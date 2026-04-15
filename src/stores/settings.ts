import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { invoke } from "@tauri-apps/api/core";
import Database from "@tauri-apps/plugin-sql";
import { enable as enableAutostart, disable as disableAutostart, isEnabled as isAutostartEnabled } from "@tauri-apps/plugin-autostart";
import { detectLocale } from "../i18n/locales";

const META_KEY = "settings.v1";

export interface AppSettings {
  autoStart: boolean;
  minimizeToTray: boolean;
  closeToMinimize: boolean;
  restoreClipboard: boolean;
  sendDelay: number;
  locale: string;
}

function defaults(): AppSettings {
  return {
    autoStart: false,
    minimizeToTray: true,
    closeToMinimize: true,
    restoreClipboard: true,
    sendDelay: 50,
    locale: "", // "" = not yet chosen, will be auto-detected on first init
  };
}

let db: Database | null = null;
async function getDb(): Promise<Database> {
  if (!db) db = await Database.load("sqlite:ggsay.db");
  return db;
}

export const useSettingsStore = defineStore("settings", () => {
  const settings = ref<AppSettings>(defaults());
  const initialized = ref(false);

  async function init() {
    if (initialized.value) return;
    const d = await getDb();
    const rows = await d.select<{ value: string }[]>(
      "SELECT value FROM meta WHERE key=?",
      [META_KEY]
    );
    let loaded = false;
    if (rows[0]?.value) {
      try {
        settings.value = { ...defaults(), ...JSON.parse(rows[0].value) };
        loaded = true;
      } catch {
        // ignore, keep defaults
      }
    }
    // First run OR stored locale empty: auto-detect from OS/browser locale.
    if (!settings.value.locale) {
      settings.value.locale = detectLocale();
    }
    // Sync actual autostart state from OS (in case user toggled externally)
    try {
      settings.value.autoStart = await isAutostartEnabled();
    } catch (e) {
      console.error("check autostart failed", e);
    }
    await applyToRust();
    initialized.value = true;
    // If this is a first run, persist now so the detected locale survives restarts.
    if (!loaded) await persist();
  }

  async function persist() {
    const d = await getDb();
    await d.execute(
      "INSERT INTO meta(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value",
      [META_KEY, JSON.stringify(settings.value)]
    );
  }

  async function applyToRust() {
    try {
      await invoke("update_settings", {
        settings: {
          close_to_minimize: settings.value.closeToMinimize,
          minimize_to_tray: settings.value.minimizeToTray,
          restore_clipboard: settings.value.restoreClipboard,
          send_delay_ms: settings.value.sendDelay,
        },
      });
    } catch (e) {
      console.error("update_settings failed", e);
    }
  }

  async function setAutoStart(enabled: boolean) {
    try {
      if (enabled) await enableAutostart();
      else await disableAutostart();
      settings.value.autoStart = enabled;
    } catch (e) {
      console.error("autostart toggle failed", e);
      // revert UI on failure
      settings.value.autoStart = await isAutostartEnabled().catch(() => false);
    }
  }

  // Persist + push to Rust whenever settings change (after init)
  watch(
    () => ({ ...settings.value }),
    async () => {
      if (!initialized.value) return;
      await persist();
      await applyToRust();
    },
    { deep: true }
  );

  return {
    settings,
    initialized,
    init,
    setAutoStart,
  };
});

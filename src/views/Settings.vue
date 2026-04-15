<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { getVersion } from "@tauri-apps/api/app";
import { useSettingsStore } from "../stores/settings";
import { LOCALES } from "../i18n/locales";

const { t, locale } = useI18n();
const store = useSettingsStore();
const version = ref("");
const langOpen = ref(false);
const langRef = ref<HTMLElement | null>(null);

const currentLocale = computed(
  () => LOCALES.find((l) => l.code === locale.value) ?? LOCALES[0]
);

onMounted(async () => {
  try { version.value = await getVersion(); }
  catch { version.value = "?"; }
  document.addEventListener("mousedown", onDocMouseDown);
});

onUnmounted(() => {
  document.removeEventListener("mousedown", onDocMouseDown);
});

function onDocMouseDown(e: MouseEvent) {
  if (langRef.value && !langRef.value.contains(e.target as Node)) {
    langOpen.value = false;
  }
}

function selectLocale(code: string) {
  locale.value = code as typeof locale.value;
  store.settings.locale = code;
  langOpen.value = false;
}

async function onAutoStartChange(e: Event) {
  const checked = (e.target as HTMLInputElement).checked;
  await store.setAutoStart(checked);
}
</script>

<template>
  <div class="settings-page">
    <h1 class="page-title">{{ t('settings.title') }}</h1>

    <section class="card">
      <h2 class="card-title">{{ t('settings.general') }}</h2>
      <div class="setting-row">
        <span class="setting-label">{{ t('settings.autoStart') }}</span>
        <label class="toggle">
          <input type="checkbox" :checked="store.settings.autoStart" @change="onAutoStartChange" />
          <span class="toggle-track"></span>
        </label>
      </div>
      <div class="setting-row">
        <span class="setting-label">{{ t('settings.minimizeToTray') }}</span>
        <label class="toggle">
          <input type="checkbox" v-model="store.settings.minimizeToTray" />
          <span class="toggle-track"></span>
        </label>
      </div>
      <div class="setting-row">
        <span class="setting-label">{{ t('settings.closeToMinimize') }}</span>
        <label class="toggle">
          <input type="checkbox" v-model="store.settings.closeToMinimize" />
          <span class="toggle-track"></span>
        </label>
      </div>
      <div class="setting-row">
        <span class="setting-label">{{ t('settings.language') }}</span>
        <div class="lang-picker" ref="langRef">
          <button class="lang-trigger" @click="langOpen = !langOpen">
            <span :class="`fi fi-${currentLocale.country}`"></span>
            <span class="lang-name">{{ currentLocale.name }}</span>
            <span class="lang-caret" :class="{ open: langOpen }">▾</span>
          </button>
          <div v-if="langOpen" class="lang-menu">
            <button
              v-for="l in LOCALES"
              :key="l.code"
              class="lang-option"
              :class="{ active: l.code === locale }"
              @click="selectLocale(l.code)"
            >
              <span :class="`fi fi-${l.country}`"></span>
              <span class="lang-name">{{ l.name }}</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="card">
      <h2 class="card-title">{{ t('settings.send') }}</h2>
      <div class="setting-row">
        <span class="setting-label">{{ t('settings.restoreClipboard') }}</span>
        <label class="toggle">
          <input type="checkbox" v-model="store.settings.restoreClipboard" />
          <span class="toggle-track"></span>
        </label>
      </div>
      <div class="setting-row">
        <span class="setting-label">{{ t('settings.sendDelay') }}</span>
        <input
          type="number"
          v-model.number="store.settings.sendDelay"
          class="setting-input"
          min="10"
          max="1000"
          step="10"
        />
      </div>
    </section>

    <section class="card">
      <h2 class="card-title">{{ t('settings.about') }}</h2>
      <div class="setting-row">
        <span class="setting-label">{{ t('settings.version') }}</span>
        <span class="setting-value">{{ version }}</span>
      </div>
    </section>
  </div>
</template>

<style scoped>
.settings-page { max-width: 520px; }
.page-title { font-size: 20px; font-weight: 700; margin-bottom: 24px; letter-spacing: -0.02em; }
.card { background: var(--color-bg-card); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: 20px; margin-bottom: 12px; }
.card-title { font-size: 11px; font-weight: 700; color: var(--color-text-secondary); margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.08em; }
.setting-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; }
.setting-row + .setting-row { border-top: 1px solid var(--color-border); }
.setting-label { font-size: 13px; }
.setting-value { font-size: 13px; color: var(--color-text-muted); }
.setting-input { width: 72px; padding: 6px 10px; background: var(--color-bg-input); border: 1px solid var(--color-border); border-radius: var(--radius); text-align: center; outline: none; font-variant-numeric: tabular-nums; transition: border-color var(--transition); }
.setting-input:focus { border-color: var(--color-primary); box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.15); }
.lang-picker { position: relative; }
.lang-trigger {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 6px 12px; min-width: 170px;
  background: var(--color-bg-input); border: 1px solid var(--color-border);
  border-radius: var(--radius); font-size: 13px; color: var(--color-text);
  cursor: pointer; transition: border-color var(--transition);
}
.lang-trigger:hover { border-color: var(--color-primary); }
.lang-trigger .fi { width: 18px; height: 13px; border-radius: 2px; flex-shrink: 0; }
.lang-trigger .lang-name { flex: 1; text-align: left; }
.lang-caret { font-size: 10px; color: var(--color-text-muted); transition: transform 0.15s; }
.lang-caret.open { transform: rotate(180deg); }
.lang-menu {
  position: absolute; right: 0; top: calc(100% + 4px); z-index: 10;
  min-width: 180px;
  background: var(--color-bg-card); border: 1px solid var(--color-border);
  border-radius: var(--radius); padding: 4px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  max-height: 320px; overflow-y: auto;
}
.lang-option {
  display: flex; align-items: center; gap: 8px;
  width: 100%; padding: 7px 10px;
  background: transparent; border: none; border-radius: var(--radius-sm);
  font-size: 13px; color: var(--color-text); cursor: pointer;
  text-align: left;
}
.lang-option:hover { background: var(--color-bg-hover); }
.lang-option.active { background: var(--color-bg-hover); color: var(--color-primary); font-weight: 600; }
.lang-option .fi { width: 18px; height: 13px; border-radius: 2px; flex-shrink: 0; }
.toggle { position: relative; cursor: pointer; }
.toggle input { position: absolute; opacity: 0; width: 0; height: 0; }
.toggle-track { display: block; width: 38px; height: 20px; background: var(--color-border); border-radius: 10px; transition: background 0.2s; position: relative; }
.toggle-track::after { content: ""; position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; background: var(--color-text-secondary); border-radius: 50%; transition: all 0.2s; }
.toggle input:checked + .toggle-track { background: var(--color-primary); }
.toggle input:checked + .toggle-track::after { transform: translateX(18px); background: #fff; }
</style>

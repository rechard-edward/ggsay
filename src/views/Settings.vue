<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { getVersion } from "@tauri-apps/api/app";
import { useSettingsStore } from "../stores/settings";
import { LOCALES } from "../i18n/locales";

const { t, locale } = useI18n();
const store = useSettingsStore();
const version = ref("");

onMounted(async () => {
  try { version.value = await getVersion(); }
  catch { version.value = "?"; }
});

function onLocaleChange(e: Event) {
  const v = (e.target as HTMLSelectElement).value;
  locale.value = v as typeof locale.value;
  store.settings.locale = v;
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
        <select class="lang-select" :value="locale" @change="onLocaleChange">
          <option v-for="l in LOCALES" :key="l.code" :value="l.code">
            {{ l.flag }} {{ l.name }}
          </option>
        </select>
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
.lang-select { padding: 6px 12px; background: var(--color-bg-input); border: 1px solid var(--color-border); border-radius: var(--radius); font-size: 13px; color: var(--color-text); outline: none; cursor: pointer; min-width: 160px; transition: border-color var(--transition); }
.lang-select:hover { border-color: var(--color-primary); }
.lang-select:focus { border-color: var(--color-primary); box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.15); }
.toggle { position: relative; cursor: pointer; }
.toggle input { position: absolute; opacity: 0; width: 0; height: 0; }
.toggle-track { display: block; width: 38px; height: 20px; background: var(--color-border); border-radius: 10px; transition: background 0.2s; position: relative; }
.toggle-track::after { content: ""; position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; background: var(--color-text-secondary); border-radius: 50%; transition: all 0.2s; }
.toggle input:checked + .toggle-track { background: var(--color-primary); }
.toggle input:checked + .toggle-track::after { transform: translateX(18px); background: #fff; }
</style>

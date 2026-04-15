<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useGamesStore } from "../stores/games";

const { t } = useI18n();
const store = useGamesStore();

const props = defineProps<{
  modelValue: string;
  placeholder?: string;
  gameId?: string;
  msgId?: string;
  compact?: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const recording = ref(false);
const conflict = ref<string | null>(null);

function getAllUsedHotkeys(): Array<{ hotkey: string; label: string; gameId: string; msgId?: string }> {
  const used: Array<{ hotkey: string; label: string; gameId: string; msgId?: string }> = [];
  for (const game of store.games) {
    if (game.triggerMode === "single" && game.singleHotkey) {
      used.push({ hotkey: game.singleHotkey, label: game.name, gameId: game.id });
    }
    if (game.triggerMode === "multi") {
      for (const group of game.groups) {
        for (const msg of group.messages) {
          if (msg.hotkey) {
            used.push({
              hotkey: msg.hotkey,
              label: `${game.name} > ${group.name} > "${msg.content}"`,
              gameId: game.id,
              msgId: msg.id,
            });
          }
        }
      }
    }
  }
  return used;
}

function checkConflict(hotkey: string): string | null {
  const used = getAllUsedHotkeys();
  const existing = used.find(
    (u) => u.hotkey === hotkey && !(u.gameId === props.gameId && u.msgId === props.msgId)
  );
  return existing ? existing.label : null;
}

let wasListening = false;

async function startRecording() {
  wasListening = store.isListening;
  // Always clear OS-level hotkey grabs so the keypress reaches the webview,
  // even if we think isListening is false (state may be stale after mode switch).
  await store.pauseListening();
  recording.value = true;
  conflict.value = null;
  window.addEventListener("keydown", onKeyDown);
}

async function finishRecording() {
  window.removeEventListener("keydown", onKeyDown);
  recording.value = false;
  if (wasListening) await store.resumeListening();
  wasListening = false;
}

function onKeyDown(e: KeyboardEvent) {
  e.preventDefault();
  e.stopPropagation();
  if (e.key === "Escape") { finishRecording(); return; }
  const key = e.key;
  // Wait until a non-modifier key is pressed so "Ctrl alone" isn't captured.
  if (["Control", "Alt", "Shift", "Meta"].includes(key)) return;

  const parts: string[] = [];
  if (e.ctrlKey) parts.push("Ctrl");
  if (e.altKey) parts.push("Alt");
  if (e.shiftKey) parts.push("Shift");
  if (e.metaKey) parts.push("Meta");
  parts.push(key.length === 1 ? key.toUpperCase() : key);

  const hotkey = parts.join("+");
  const conflictLabel = checkConflict(hotkey);
  if (conflictLabel) {
    conflict.value = conflictLabel;
  } else {
    conflict.value = null;
    emit("update:modelValue", hotkey);
  }
  finishRecording();
}

function clear() {
  conflict.value = null;
  emit("update:modelValue", "");
}
</script>

<template>
  <div class="hk-wrap">
    <div class="hk-row" :class="{ compact }">
      <button class="hk-btn" :class="{ compact }" @click="startRecording" v-if="!recording">
        <span class="hk-val" v-if="modelValue">{{ modelValue }}</span>
        <span class="hk-ph" v-else>{{ placeholder || t('hotkey.clickToSet') }}</span>
      </button>
      <span class="hk-rec" :class="{ compact }" v-else>{{ t('hotkey.recording') }}</span>
      <button class="hk-x" v-if="modelValue && !recording" @click="clear">
        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
      </button>
    </div>
    <div class="hk-conflict" v-if="conflict">
      {{ t('hotkey.conflict', { label: conflict }) }}
      <button class="hk-retry" @click="startRecording">{{ t('hotkey.retry') }}</button>
    </div>
  </div>
</template>

<style scoped>
.hk-wrap { display: flex; flex-direction: column; gap: 3px; }
.hk-row { display: inline-flex; align-items: center; gap: 3px; }

.hk-btn {
  padding: 5px 14px;
  background: var(--color-bg-input);
  border: 1px solid var(--color-border);
  border-radius: 5px;
  font-size: 12px;
  min-width: 80px;
  text-align: center;
}
.hk-btn.compact { padding: 3px 10px; min-width: 60px; font-size: 11px; }
.hk-btn:hover { border-color: var(--color-primary); }

.hk-val { color: var(--color-secondary); font-weight: 700; font-family: "Inter", monospace; letter-spacing: 0.02em; }
.hk-ph { color: var(--color-text-muted); font-size: 11px; }

.hk-rec {
  padding: 5px 12px;
  background: var(--color-primary);
  color: #fff;
  border-radius: 5px;
  font-size: 11px;
  font-weight: 600;
  animation: pulse 1.2s ease-in-out infinite;
}
.hk-rec.compact { padding: 3px 10px; font-size: 10px; }

@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }

.hk-x {
  padding: 3px;
  color: var(--color-text-muted);
  border-radius: 3px;
  display: inline-flex;
}
.hk-x:hover { color: var(--color-danger); background: rgba(239, 68, 68, 0.1); }

.hk-conflict { font-size: 10px; color: var(--color-danger); line-height: 1.3; }
.hk-retry { color: var(--color-primary); font-size: 10px; text-decoration: underline; margin-left: 3px; }
</style>

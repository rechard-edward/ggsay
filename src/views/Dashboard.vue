<script setup lang="ts">
import { computed } from "vue";
import { useGamesStore } from "../stores/games";
import { useI18n } from "vue-i18n";
import HotkeyInput from "../components/HotkeyInput.vue";

const { t } = useI18n();
const store = useGamesStore();

const hasHotkey = computed(() => {
  if (!store.activeGame) return false;
  if (store.activeGame.triggerMode === "single") {
    return !!store.activeGame.singleHotkey;
  }
  // Multi mode: at least one message in active group has a hotkey
  if (!store.activeGroup) return false;
  return store.activeGroup.messages.some((m) => m.hotkey);
});

const canListen = computed(() =>
  store.activeGame !== null && store.activeGroup !== null && hasHotkey.value
);

const cantReason = computed(() => {
  if (!store.activeGame) return t('dashboard.cannotStart');
  if (!store.activeGroup) return t('dashboard.noGroupSelected');
  if (!hasHotkey.value) return t('dashboard.noHotkey');
  return "";
});
</script>

<template>
  <div class="dashboard">
    <h1 class="page-title">{{ t('dashboard.title') }}</h1>

    <div class="status-card">
      <div class="status-header">
        <div class="status-badge" :class="{ active: store.isListening }">
          <span class="status-dot"></span>
          <span>{{ store.isListening ? t('dashboard.listening') : t('dashboard.stopped') }}</span>
        </div>
      </div>

      <div class="status-fields">
        <div class="field">
          <label>{{ t('dashboard.game') }}</label>
          <select v-model="store.activeGameId" class="field-select">
            <option v-for="game in store.games" :key="game.id" :value="game.id">
              {{ game.name }}
            </option>
          </select>
        </div>

        <div class="field" v-if="store.activeGame">
          <label>{{ t('dashboard.group') }}</label>
          <select
            :value="store.activeGame.activeGroupId"
            @change="store.setActiveGroup(store.activeGame!.id, ($event.target as HTMLSelectElement).value)"
            class="field-select"
          >
            <option v-for="group in store.activeGame.groups" :key="group.id" :value="group.id">
              {{ group.name }}
            </option>
          </select>
        </div>

        <div class="field" v-if="store.activeGame">
          <label>{{ t('dashboard.mode') }}</label>
          <div class="seg">
            <button :class="{ on: store.activeGame.triggerMode === 'single' }" @click="store.updateGame(store.activeGame!.id, { triggerMode: 'single' })">{{ t('dashboard.singleMode') }}</button>
            <button :class="{ on: store.activeGame.triggerMode === 'multi' }" @click="store.updateGame(store.activeGame!.id, { triggerMode: 'multi' })">{{ t('dashboard.multiMode') }}</button>
          </div>
        </div>

        <div class="field" v-if="store.activeGame && store.activeGame.triggerMode === 'single'">
          <label>{{ t('gameDetail.triggerHotkey') }}</label>
          <HotkeyInput
            :modelValue="store.activeGame.singleHotkey"
            @update:modelValue="store.updateGame(store.activeGame!.id, { singleHotkey: $event })"
            :gameId="store.activeGame.id"
            compact
          />
        </div>
      </div>

      <button
        class="toggle-btn"
        :class="{ listening: store.isListening, disabled: !canListen && !store.isListening }"
        @click="canListen || store.isListening ? store.toggleListening() : undefined"
        :disabled="!canListen && !store.isListening"
      >
        <svg v-if="!store.isListening" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
        <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
        {{ store.isListening ? t('dashboard.stopListening') : t('dashboard.startListening') }}
      </button>
      <p class="cannot-start-hint" v-if="!canListen && !store.isListening">{{ cantReason }}</p>
    </div>

    <div class="log-card" v-if="store.activeGame">
      <h2 class="card-title">{{ t('dashboard.sendLog') }}</h2>
      <div class="log-list" v-if="store.sendLogs.length">
        <div class="log-item" v-for="(log, i) in store.sendLogs" :key="i">
          <span class="log-time">{{ log.time }}</span>
          <span class="log-content">{{ log.content }}</span>
          <span class="log-hotkey">{{ log.hotkey }}</span>
        </div>
      </div>
      <div class="log-empty" v-else>
        {{ t('dashboard.noLogs') }}
      </div>
    </div>

    <div class="empty-state" v-if="!store.games.length">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="6" y1="11" x2="10" y2="11" /><line x1="8" y1="9" x2="8" y2="13" /><line x1="15" y1="12" x2="15.01" y2="12" /><line x1="18" y1="10" x2="18.01" y2="10" />
        <path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.544-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z" />
      </svg>
      <p>{{ t('dashboard.noGames') }}</p>
      <RouterLink to="/games" class="empty-link">{{ t('dashboard.goToGames') }}</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  max-width: 600px;
}

.page-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 24px;
  letter-spacing: -0.02em;
}

.status-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 24px;
  margin-bottom: 16px;
}

.status-header {
  margin-bottom: 20px;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-danger);
}

.status-badge.active {
  background: rgba(52, 211, 153, 0.1);
  color: var(--color-success);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}

.status-badge.active .status-dot {
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.status-fields {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.field {
  display: flex;
  align-items: center;
  gap: 12px;
}

.field label {
  width: 48px;
  color: var(--color-text-secondary);
  font-size: 13px;
  flex-shrink: 0;
}

.field-select {
  flex: 1;
  padding: 8px 12px;
  background: var(--color-bg-input);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  color: var(--color-text);
  outline: none;
  transition: border-color var(--transition);
}

.field-select:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.15);
}

.field-value {
  font-size: 13px;
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.hotkey-tag {
  display: inline-block;
  padding: 2px 8px;
  background: rgba(124, 58, 237, 0.15);
  color: var(--color-secondary);
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: 600;
  font-family: "Inter", monospace;
}

.seg {
  display: flex;
  background: var(--color-bg-input);
  border-radius: 5px;
  padding: 2px;
}

.seg button {
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-muted);
  border-radius: 3px;
  white-space: nowrap;
  transition: all var(--transition);
}

.seg button.on {
  background: var(--color-primary);
  color: #fff;
  box-shadow: 0 1px 4px rgba(124, 58, 237, 0.25);
}

.seg button:hover:not(.on) {
  color: var(--color-text-secondary);
}

.toggle-btn {
  width: 100%;
  padding: 10px;
  border-radius: var(--radius);
  background: var(--color-primary);
  color: #fff;
  font-weight: 600;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.toggle-btn:hover {
  background: var(--color-primary-hover);
}

.toggle-btn.listening {
  background: rgba(239, 68, 68, 0.15);
  color: var(--color-danger);
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.toggle-btn.listening:hover {
  background: rgba(239, 68, 68, 0.25);
}

.toggle-btn.disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.toggle-btn.disabled:hover {
  background: var(--color-primary);
}

.cannot-start-hint {
  text-align: center;
  font-size: 12px;
  color: var(--color-warning);
  margin-top: 8px;
}

.log-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 20px;
}

.card-title {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.log-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-height: 280px;
  overflow-y: auto;
}

.log-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 10px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  transition: background var(--transition);
}

.log-item:hover {
  background: var(--color-bg-hover);
}

.log-time {
  color: var(--color-text-muted);
  font-variant-numeric: tabular-nums;
  font-size: 12px;
  flex-shrink: 0;
}

.log-content {
  flex: 1;
  color: var(--color-text);
}

.log-hotkey {
  color: var(--color-secondary);
  font-size: 11px;
  font-weight: 600;
  flex-shrink: 0;
}

.log-empty {
  color: var(--color-text-muted);
  font-size: 13px;
  text-align: center;
  padding: 32px;
}

.empty-state {
  text-align: center;
  padding: 64px 0;
  color: var(--color-text-muted);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.empty-state p {
  font-size: 14px;
}

.empty-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--color-primary);
  font-size: 13px;
  font-weight: 500;
}
</style>

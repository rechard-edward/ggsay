<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useGamesStore } from "../stores/games";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const store = useGamesStore();
const router = useRouter();
const showAdd = ref(false);
const newName = ref("");

function handleDeleteGame(e: Event, gameId: string, gameName: string) {
  e.stopPropagation();
  if (!confirm(t('gameDetail.deleteGameConfirm', { name: gameName }))) return;
  store.removeGame(gameId);
}

async function handleAdd() {
  const name = newName.value.trim();
  if (!name) return;
  const game = await store.addGame(name);
  newName.value = "";
  showAdd.value = false;
  router.push(`/games/${game.id}`);
}

function totalMessages(gameId: string): number {
  const game = store.games.find((g) => g.id === gameId);
  if (!game) return 0;
  return game.groups.reduce((sum, g) => sum + g.messages.length, 0);
}
</script>

<template>
  <div class="games-page">
    <div class="page-header">
      <h1 class="page-title">{{ t('games.title') }}</h1>
      <button class="add-btn" @click="showAdd = true" v-if="!showAdd">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
        {{ t('games.addGame') }}
      </button>
    </div>

    <div class="add-form" v-if="showAdd">
      <input
        v-model="newName"
        class="add-input"
        :placeholder="t('games.gameName')"
        @keyup.enter="handleAdd"
        autofocus
      />
      <button class="confirm-btn" @click="handleAdd">{{ t('games.confirm') }}</button>
      <button class="cancel-btn" @click="showAdd = false; newName = ''">{{ t('games.cancel') }}</button>
    </div>

    <div class="games-grid">
      <div
        class="game-card"
        v-for="game in store.games"
        :key="game.id"
        @click="router.push(`/games/${game.id}`)"
      >
        <div class="game-top">
          <div class="game-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-secondary)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="6" y1="11" x2="10" y2="11" /><line x1="8" y1="9" x2="8" y2="13" /><line x1="15" y1="12" x2="15.01" y2="12" /><line x1="18" y1="10" x2="18.01" y2="10" />
              <path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.544-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z" />
            </svg>
          </div>
          <button class="game-del" @click="handleDeleteGame($event, game.id, game.name)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
          </button>
        </div>
        <div class="game-name">{{ game.name }}</div>
        <div class="game-stats">
          <span>{{ game.groups.length }} {{ t('games.groups') }}</span>
          <span class="stats-sep">·</span>
          <span>{{ totalMessages(game.id) }} {{ t('games.messages') }}</span>
        </div>
      </div>
    </div>

    <div class="empty-state" v-if="!store.games.length && !showAdd">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="6" y1="11" x2="10" y2="11" /><line x1="8" y1="9" x2="8" y2="13" /><line x1="15" y1="12" x2="15.01" y2="12" /><line x1="18" y1="10" x2="18.01" y2="10" />
        <path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.544-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z" />
      </svg>
      <p>{{ t('games.noGames') }}</p>
      <p class="empty-hint">{{ t('games.noGamesHint') }}</p>
    </div>
  </div>
</template>

<style scoped>
.games-page {
  max-width: 800px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.page-title {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.add-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: var(--color-primary);
  color: #fff;
  border-radius: var(--radius);
  font-weight: 600;
  font-size: 13px;
}

.add-btn:hover {
  background: var(--color-primary-hover);
}

.add-form {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
}

.add-input {
  flex: 1;
  padding: 9px 14px;
  background: var(--color-bg-input);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  outline: none;
  transition: border-color var(--transition);
}

.add-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.15);
}

.confirm-btn {
  padding: 8px 18px;
  background: var(--color-primary);
  color: #fff;
  border-radius: var(--radius);
  font-weight: 600;
  font-size: 13px;
}

.confirm-btn:hover {
  background: var(--color-primary-hover);
}

.cancel-btn {
  padding: 8px 14px;
  color: var(--color-text-secondary);
  font-size: 13px;
}

.cancel-btn:hover {
  color: var(--color-text);
}

.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
}

.game-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 20px;
  cursor: pointer;
  transition: all var(--transition);
}

.game-card:hover {
  border-color: var(--color-primary);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.1);
}

.game-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 14px;
}

.game-icon {
  opacity: 0.7;
}

.game-del {
  color: var(--color-text-muted);
  padding: 4px;
  border-radius: 4px;
  opacity: 0;
  transition: all var(--transition);
}

.game-card:hover .game-del {
  opacity: 1;
}

.game-del:hover {
  color: var(--color-danger);
  background: rgba(239, 68, 68, 0.1);
}

.game-name {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 8px;
}

.game-stats {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--color-text-muted);
}

.stats-sep {
  color: var(--color-border);
}

.empty-state {
  text-align: center;
  padding: 64px 0;
  color: var(--color-text-muted);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.empty-state p {
  font-size: 14px;
}

.empty-hint {
  font-size: 13px;
}
</style>

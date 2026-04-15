<script setup lang="ts">
import { ref, computed, nextTick } from "vue";
import { useRoute, useRouter, onBeforeRouteLeave } from "vue-router";
import { useGamesStore } from "../stores/games";
import { useI18n } from "vue-i18n";
import HotkeyInput from "../components/HotkeyInput.vue";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const store = useGamesStore();

const game = computed(() => store.games.find((g) => g.id === route.params.id) ?? null);
const activeGroup = computed(() => {
  if (!game.value || !game.value.activeGroupId) return null;
  return game.value.groups.find((g) => g.id === game.value!.activeGroupId) ?? null;
});


// Groups
const addingGroup = ref(false);
const newGroupName = ref("");
const addGroupInput = ref<HTMLInputElement | null>(null);
function startAddGroup() { addingGroup.value = true; newGroupName.value = ""; nextTick(() => addGroupInput.value?.focus()); }
function handleAddGroup() { if (!game.value) return; const n = newGroupName.value.trim(); if (!n) return; store.addGroup(game.value.id, n); newGroupName.value = ""; addingGroup.value = false; }
function cancelAddGroup() { addingGroup.value = false; newGroupName.value = ""; }

const renamingGroupId = ref<string | null>(null);
const renameGroupValue = ref("");
function startRenameGroup(gid: string, n: string) { renamingGroupId.value = gid; renameGroupValue.value = n; }
function saveRenameGroup(gid: string) { if (!game.value) return; const n = renameGroupValue.value.trim(); if (n) store.updateGroup(game.value.id, gid, n); renamingGroupId.value = null; }
function handleDeleteGroup(gid: string, gn: string) { if (!game.value || !confirm(t('gameDetail.deleteGroupConfirm', { name: gn }))) return; store.removeGroup(game.value.id, gid); }

// Messages
const newMsgContent = ref("");
const editingMsgId = ref<string | null>(null);
const editMsgContent = ref("");
function handleAddMsg() { if (!game.value || !game.value.activeGroupId) return; const c = newMsgContent.value.trim(); if (!c) return; store.addMessage(game.value.id, game.value.activeGroupId, c); newMsgContent.value = ""; }
function startEditMsg(id: string, c: string) {
  // Save previous edit if any
  if (editingMsgId.value && editingMsgId.value !== id) {
    saveMsg(editingMsgId.value);
  }
  editingMsgId.value = id;
  editMsgContent.value = c;
}
function saveMsg(id: string) {
  if (!game.value) { editingMsgId.value = null; return; }
  // Find the group that contains this message (might not be activeGroup if user switched)
  const grp = game.value.groups.find((g) => g.messages.some((m) => m.id === id));
  if (grp) {
    const c = editMsgContent.value.trim();
    if (c) store.updateMessage(game.value.id, grp.id, id, { content: c });
  }
  editingMsgId.value = null;
}

function flushAll() {
  if (editingMsgId.value) saveMsg(editingMsgId.value);
  if (renamingGroupId.value) saveRenameGroup(renamingGroupId.value);
  if (addingGroup.value && newGroupName.value.trim()) handleAddGroup();
  else if (addingGroup.value) cancelAddGroup();
}

onBeforeRouteLeave(() => { flushAll(); });
function handleDeleteMsg(id: string) { if (!game.value || !game.value.activeGroupId) return; store.removeMessage(game.value.id, game.value.activeGroupId, id); }
</script>

<template>
  <div class="page" v-if="game" @mousedown="flushAll()">
    <!-- Header -->
    <div class="hdr">
      <button class="hdr-back" @click="router.push('/games')">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="15 18 9 12 15 6" /></svg>
      </button>
      <div class="hdr-info">
        <h1>{{ game.name }}</h1>
      </div>
    </div>

    <!-- Toolbar -->
    <div class="toolbar">
      <div class="tb-item">
        <label :title="t('gameDetail.preActionHint')">{{ t('gameDetail.preAction') }}</label>
        <HotkeyInput :modelValue="game.action.preAction" @update:modelValue="store.updateGame(game.id, { action: { ...game.action, preAction: $event } })" :placeholder="t('gameDetail.preActionPlaceholder')" compact />
      </div>
      <span class="tb-arrow">→</span>
      <span class="tb-step">{{ t('gameDetail.pasteStep') }}</span>
      <span class="tb-arrow">→</span>
      <div class="tb-item">
        <label :title="t('gameDetail.postActionHint')">{{ t('gameDetail.postAction') }}</label>
        <HotkeyInput :modelValue="game.action.postAction" @update:modelValue="store.updateGame(game.id, { action: { ...game.action, postAction: $event } })" :placeholder="t('gameDetail.postActionPlaceholder')" compact />
      </div>
      <div class="tb-sep"></div>
      <div class="tb-item">
        <div class="seg">
          <button :class="{ on: game.triggerMode === 'single' }" @click="store.updateGame(game.id, { triggerMode: 'single' })">{{ t('gameDetail.singleMode') }}</button>
          <button :class="{ on: game.triggerMode === 'multi' }" @click="store.updateGame(game.id, { triggerMode: 'multi' })">{{ t('gameDetail.multiMode') }}</button>
        </div>
      </div>
      <div class="tb-item" v-if="game.triggerMode === 'single'">
        <label>{{ t('gameDetail.triggerHotkey') }}</label>
        <HotkeyInput :modelValue="game.singleHotkey" @update:modelValue="store.updateGame(game.id, { singleHotkey: $event })" :gameId="game.id" compact />
      </div>
    </div>

    <!-- Action tip banner -->
    <div class="action-tip">
      <strong>{{ t('gameDetail.actionTip') }}</strong>
      <span>{{ t('gameDetail.actionTipExample') }}</span>
    </div>

    <!-- Master-Detail Workspace -->
    <div class="workspace">
      <!-- Left: Group List -->
      <div class="sidebar-groups">
        <div class="sg-header">
          <span class="sg-title">{{ t('gameDetail.groupManagement') }}</span>
        </div>
        <div class="sg-list">
          <button
            v-for="g in game.groups" :key="g.id"
            class="sg-item"
            :class="{ active: game.activeGroupId === g.id }"
            @click="flushAll(); store.setActiveGroup(game.id, g.id)"
            @dblclick.stop="startRenameGroup(g.id, g.name)"
          >
            <template v-if="renamingGroupId !== g.id">
              <span class="sg-radio" :class="{ on: game.activeGroupId === g.id }"></span>
              <span class="sg-name">{{ g.name }}</span>
              <span class="sg-count">{{ g.messages.length }}</span>
              <span class="sg-del" v-if="game.activeGroupId === g.id" @click.stop="handleDeleteGroup(g.id, g.name)">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </span>
            </template>
            <input
              v-else
              v-model="renameGroupValue"
              class="sg-rename"
              @keyup.enter.stop="saveRenameGroup(g.id)"
              @blur="saveRenameGroup(g.id)"
              @click.stop
              @mousedown.stop
              autofocus
            />
          </button>

          <!-- Add group inline -->
          <div class="sg-add-form" v-if="addingGroup" @mousedown.stop>
            <input
              ref="addGroupInput"
              v-model="newGroupName"
              class="sg-add-input"
              :placeholder="t('groupModal.groupNamePlaceholder')"
              @keyup.enter="handleAddGroup"
              @keyup.escape="cancelAddGroup"
              @blur="newGroupName.trim() ? handleAddGroup() : cancelAddGroup()"
            />
          </div>
        </div>
        <button class="sg-new-btn" @click="startAddGroup" v-if="!addingGroup">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          {{ t('gameDetail.addGroup') }}
        </button>
      </div>

      <!-- Right: Message Detail -->
      <div class="detail">
        <template v-if="activeGroup">
          <!-- Detail header -->
          <div class="dt-header">
            <h2>{{ activeGroup.name }}</h2>
            <span class="dt-count">{{ activeGroup.messages.length }} {{ t('games.messages') }}</span>
          </div>

          <!-- Column header for multi mode -->
          <div class="dt-colhdr" v-if="game.triggerMode === 'multi' && activeGroup.messages.length">
            <span class="c-idx">#</span>
            <span class="c-msg">{{ t('gameDetail.messageContent') }}</span>
            <span class="c-hk">{{ t('gameDetail.triggerHotkey') }}</span>
            <span class="c-ops"></span>
          </div>

          <!-- Rows -->
          <div class="dt-rows">
            <div class="row" v-for="(msg, idx) in activeGroup.messages" :key="msg.id">
              <span class="r-idx">{{ idx + 1 }}</span>
              <template v-if="editingMsgId !== msg.id">
                <span class="r-text" @mousedown.prevent.stop="startEditMsg(msg.id, msg.content)">{{ msg.content }}</span>
                <HotkeyInput
                  v-if="game.triggerMode === 'multi'"
                  class="r-hk"
                  :modelValue="msg.hotkey"
                  @update:modelValue="store.updateMessage(game.id, activeGroup!.id, msg.id, { hotkey: $event })"
                  :placeholder="t('hotkey.setHotkey')"
                  :gameId="game.id" :msgId="msg.id"
                  compact
                />
                <div class="r-ops">
                  <button class="del" @click.stop="handleDeleteMsg(msg.id)"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg></button>
                </div>
              </template>
              <template v-else>
                <input v-model="editMsgContent" class="r-einput" @keyup.enter="saveMsg(msg.id)" @keyup.escape="editingMsgId = null" @blur="saveMsg(msg.id)" @mousedown.stop autofocus />
              </template>
            </div>

            <div class="dt-empty" v-if="!activeGroup.messages.length">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" opacity="0.25"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
              <span>{{ t('groupModal.noMessages') }}</span>
            </div>
          </div>

          <!-- Add input -->
          <div class="dt-input" @mousedown.stop>
            <input v-model="newMsgContent" class="dt-add-input" :placeholder="t('groupModal.addMessagePlaceholder')" @keyup.enter="handleAddMsg" />
            <button class="dt-add-btn" @click="handleAddMsg" :disabled="!newMsgContent.trim()">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            </button>
          </div>
        </template>

        <!-- No group selected / no groups -->
        <div class="dt-placeholder" v-else>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" opacity="0.2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span v-if="game.groups.length">{{ t('dashboard.selectGroup') }}</span>
          <span v-else>{{ t('gameDetail.noGroups') }}</span>
        </div>
      </div>
    </div>
  </div>

  <div class="not-found" v-else>
    <p>{{ t('gameDetail.gameNotFound') }}</p>
    <RouterLink to="/games">{{ t('gameDetail.backToGames') }}</RouterLink>
  </div>
</template>

<style scoped>
.page { display: flex; flex-direction: column; height: calc(100vh - 64px); }

/* ── Header ── */
.hdr { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; flex-shrink: 0; }
.hdr-back { color: var(--color-text-muted); padding: 5px; border-radius: 5px; }
.hdr-back:hover { color: var(--color-text); background: var(--color-bg-hover); }
.hdr-info { flex: 1; min-width: 0; }
.hdr-info h1 { font-size: 17px; font-weight: 700; letter-spacing: -0.03em; cursor: default; margin: 0; }

/* ── Toolbar ── */
.toolbar {
  display: flex; align-items: center; gap: 10px; padding: 8px 14px;
  background: var(--color-bg-card); border: 1px solid var(--color-border);
  border-radius: 8px; flex-shrink: 0; margin-bottom: 12px; flex-wrap: wrap;
}
.tb-item { display: flex; align-items: center; gap: 6px; }
.tb-item label { font-size: 10px; color: var(--color-text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; white-space: nowrap; }
.tb-arrow { color: var(--color-text-muted); font-size: 12px; opacity: 0.35; }
.tb-step { font-size: 11px; color: var(--color-text-muted); padding: 3px 8px; border-radius: 4px; background: var(--color-bg-hover); }
.tb-item label { cursor: help; }
.action-tip {
  margin: 8px 0 16px;
  padding: 8px 14px;
  background: var(--color-bg-hover);
  border-left: 3px solid var(--color-primary);
  border-radius: 4px;
  font-size: 12px;
  line-height: 1.6;
  color: var(--color-text-secondary);
}
.action-tip strong { color: var(--color-text); margin-right: 6px; font-weight: 600; }
.tb-sep { width: 1px; height: 20px; background: var(--color-border); }
.seg { display: flex; background: var(--color-bg); border-radius: 5px; padding: 2px; }
.seg button { padding: 3px 10px; font-size: 11px; font-weight: 600; color: var(--color-text-muted); border-radius: 3px; white-space: nowrap; }
.seg button.on { background: var(--color-primary); color: #fff; box-shadow: 0 1px 4px rgba(124,58,237,0.25); }
.seg button:hover:not(.on) { color: var(--color-text-secondary); }

/* ── Workspace ── */
.workspace {
  flex: 1; display: flex; min-height: 0;
  border: 1px solid var(--color-border); border-radius: 10px; overflow: hidden;
}

/* ── Left: Groups ── */
.sidebar-groups {
  width: 180px; min-width: 180px;
  display: flex; flex-direction: column;
  background: var(--color-bg-secondary);
  border-right: 1px solid var(--color-border);
}

.sg-header {
  padding: 12px 14px 8px;
}

.sg-title {
  font-size: 10px; font-weight: 700; color: var(--color-text-muted);
  text-transform: uppercase; letter-spacing: 0.08em;
}

.sg-list { flex: 1; overflow-y: auto; padding: 0 6px; }

.sg-item {
  display: flex; align-items: center; gap: 8px;
  width: 100%; padding: 8px 10px;
  border-radius: 6px; font-size: 13px;
  color: var(--color-text-secondary);
  text-align: left;
  transition: all 100ms;
  position: relative;
}
.sg-item:hover { background: var(--color-bg-hover); color: var(--color-text); }
.sg-item.active {
  background: rgba(124,58,237,0.08);
  color: var(--color-text);
}

.sg-radio {
  width: 8px; height: 8px; border-radius: 50%;
  border: 1.5px solid var(--color-text-muted);
  flex-shrink: 0;
  transition: all 100ms;
}
.sg-radio.on {
  border-color: var(--color-primary);
  background: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(124,58,237,0.2);
}

.sg-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 500; }

.sg-count {
  font-size: 10px; color: var(--color-text-muted);
  background: var(--color-bg-hover); padding: 0 5px;
  border-radius: 4px; font-weight: 600; flex-shrink: 0;
}
.sg-item.active .sg-count { background: rgba(124,58,237,0.15); color: var(--color-secondary); }

.sg-del {
  display: none; padding: 2px; border-radius: 3px;
  color: var(--color-text-muted); flex-shrink: 0;
}
.sg-item.active:hover .sg-del { display: inline-flex; }
.sg-del:hover { color: var(--color-danger); background: rgba(239,68,68,0.12); }

.sg-rename {
  flex: 1; font-size: 12px; font-weight: 500; padding: 2px 6px;
  background: var(--color-bg-input); border: 1px solid var(--color-primary);
  border-radius: 4px; outline: none; color: var(--color-text); min-width: 0;
}

/* Add group */
.sg-add-form {
  padding: 4px 6px;
}
.sg-add-input {
  width: 100%; font-size: 12px; padding: 6px 8px;
  background: var(--color-bg-input); border: 1px solid var(--color-border);
  border-radius: 5px; outline: none; color: var(--color-text);
  margin-bottom: 6px;
}
.sg-add-input:focus { border-color: var(--color-primary); box-shadow: 0 0 0 2px rgba(124,58,237,0.1); }

.sg-new-btn {
  display: flex; align-items: center; justify-content: center; gap: 6px;
  height: 49px; font-size: 11px; font-weight: 600;
  color: var(--color-text-muted);
  border-top: 1px solid var(--color-border);
  flex-shrink: 0;
}
.sg-new-btn:hover { color: var(--color-primary); background: rgba(124,58,237,0.04); }

/* ── Right: Detail ── */
.detail {
  flex: 1; display: flex; flex-direction: column; min-width: 0;
  background: linear-gradient(180deg, var(--color-bg-card) 0%, rgba(15,15,35,0.5) 100%);
}

.dt-header {
  display: flex; align-items: baseline; gap: 10px;
  padding: 14px 18px 10px; flex-shrink: 0;
}
.dt-header h2 { font-size: 15px; font-weight: 700; margin: 0; letter-spacing: -0.02em; }
.dt-count { font-size: 11px; color: var(--color-text-muted); }

.dt-colhdr {
  display: flex; align-items: center; gap: 10px;
  padding: 4px 18px; font-size: 10px; font-weight: 700;
  color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.06em;
  border-bottom: 1px solid var(--color-border);
}
.c-idx { width: 22px; text-align: right; }
.c-msg { flex: 1; }
.c-hk { width: 100px; }
.c-ops { width: 52px; }

.dt-rows { flex: 1; overflow-y: auto; }

.row {
  display: flex; align-items: center; gap: 10px;
  padding: 6px 18px;
  border-bottom: 1px solid rgba(255,255,255,0.015);
  transition: background 80ms;
}
.row:hover { background: rgba(255,255,255,0.015); }

.r-idx { font-size: 10px; color: var(--color-text-muted); width: 22px; text-align: right; flex-shrink: 0; font-variant-numeric: tabular-nums; }
.r-text { flex: 1; font-size: 13px; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; cursor: text; border-radius: 4px; padding: 2px 6px; margin: -2px -6px; }
.r-text:hover { background: rgba(255,255,255,0.03); }
.r-hk { flex-shrink: 0; }
.r-einput { flex: 1; font-size: 13px; padding: 4px 8px; background: var(--color-bg-input); border: 1px solid var(--color-primary); border-radius: 4px; outline: none; color: var(--color-text); box-shadow: 0 0 0 2px rgba(124,58,237,0.1); }

.r-ops { display: flex; gap: 1px; opacity: 0; transition: opacity 80ms; flex-shrink: 0; }
.r-ops.show, .row:hover .r-ops { opacity: 1; }
.r-ops button { padding: 4px; border-radius: 4px; color: var(--color-text-secondary); display: inline-flex; }
.r-ops button:hover { background: var(--color-bg-hover); color: var(--color-text); }
.r-ops button.del:hover { color: var(--color-danger); background: rgba(239,68,68,0.08); }
.r-ops button.ok:hover { color: var(--color-success); background: rgba(52,211,153,0.08); }

.dt-empty {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 8px; padding: 48px 0; color: var(--color-text-muted); font-size: 12px; flex: 1;
}

.dt-input {
  display: flex; gap: 6px; align-items: center;
  height: 49px; padding: 0 14px;
  border-top: 1px solid var(--color-border); flex-shrink: 0;
}
.dt-add-input {
  flex: 1; font-size: 12px; padding: 8px 12px;
  background: var(--color-bg-input); border: 1px solid var(--color-border);
  border-radius: 6px; outline: none; color: var(--color-text);
}
.dt-add-input:focus { border-color: var(--color-primary); box-shadow: 0 0 0 2px rgba(124,58,237,0.1); }
.dt-add-btn {
  padding: 8px 12px; background: var(--color-primary); color: #fff;
  border-radius: 6px; display: inline-flex; flex-shrink: 0;
}
.dt-add-btn:hover:not(:disabled) { background: var(--color-primary-hover); }
.dt-add-btn:disabled { opacity: 0.2; cursor: not-allowed; }

.dt-placeholder {
  flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 10px; color: var(--color-text-muted); font-size: 13px;
}

.not-found { text-align: center; padding: 64px 0; color: var(--color-text-muted); }
</style>

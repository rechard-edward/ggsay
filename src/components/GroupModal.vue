<script setup lang="ts">
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useGamesStore, type Group } from "../stores/games";
import Modal from "./Modal.vue";
import HotkeyInput from "./HotkeyInput.vue";

const { t } = useI18n();
const store = useGamesStore();

const props = defineProps<{
  gameId: string;
  groupId: string | null; // null = create mode
}>();

const emit = defineEmits<{
  close: [];
}>();

const groupName = ref("");
const editingMsgId = ref<string | null>(null);
const editMsgContent = ref("");
const newMsgContent = ref("");

const game = store.games.find((g) => g.id === props.gameId)!;

// Load existing group data
watch(
  () => props.groupId,
  (id) => {
    if (id) {
      const group = game.groups.find((g) => g.id === id);
      if (group) groupName.value = group.name;
    } else {
      groupName.value = "";
    }
  },
  { immediate: true }
);

function currentGroup(): Group | null {
  if (!props.groupId) return null;
  return game.groups.find((g) => g.id === props.groupId) ?? null;
}

// Save group name
async function saveGroupName() {
  const name = groupName.value.trim();
  if (!name) return;

  if (props.groupId) {
    await store.updateGroup(props.gameId, props.groupId, name);
  } else {
    const group = await store.addGroup(props.gameId, name);
    if (group) emit("close");
  }
}

function handleAddMsg() {
  if (!props.groupId) return;
  const content = newMsgContent.value.trim();
  if (!content) return;
  store.addMessage(props.gameId, props.groupId, content);
  newMsgContent.value = "";
}

function startEditMsg(msgId: string, content: string) {
  editingMsgId.value = msgId;
  editMsgContent.value = content;
}

function saveMsg(msgId: string) {
  if (!props.groupId) return;
  const content = editMsgContent.value.trim();
  if (content) {
    store.updateMessage(props.gameId, props.groupId, msgId, { content });
  }
  editingMsgId.value = null;
}

function handleDeleteMsg(msgId: string) {
  if (!props.groupId) return;
  store.removeMessage(props.gameId, props.groupId, msgId);
}

const modalTitle = props.groupId ? t('groupModal.editGroup') : t('groupModal.newGroup');
</script>

<template>
  <Modal :title="modalTitle" @close="emit('close')">
    <div class="modal-content">
      <!-- Group Name -->
      <div class="form-field">
        <label class="form-label">{{ t('groupModal.groupName') }}</label>
        <div class="name-row">
          <input
            v-model="groupName"
            class="form-input"
            :placeholder="t('groupModal.groupNamePlaceholder')"
            @keyup.enter="saveGroupName"
            autofocus
          />
          <button v-if="groupId" class="save-name-btn" @click="saveGroupName" :disabled="!groupName.trim()">
            {{ t('groupModal.save') }}
          </button>
          <button v-else class="save-name-btn primary" @click="saveGroupName" :disabled="!groupName.trim()">
            {{ t('groupModal.create') }}
          </button>
        </div>
      </div>

      <!-- Messages (only in edit mode) -->
      <template v-if="groupId && currentGroup()">
        <div class="divider"></div>

        <div class="form-field">
          <div class="messages-header">
            <label class="form-label">{{ t('groupModal.messages') }}</label>
            <span class="msg-count">{{ currentGroup()!.messages.length }}</span>
          </div>

          <!-- Message list -->
          <div class="msg-list" v-if="currentGroup()!.messages.length">
            <div
              class="msg-item"
              v-for="(msg, idx) in currentGroup()!.messages"
              :key="msg.id"
            >
              <span class="msg-num">{{ idx + 1 }}</span>

              <template v-if="editingMsgId !== msg.id">
                <span class="msg-text">{{ msg.content }}</span>
                <HotkeyInput
                  v-if="game.triggerMode === 'multi'"
                  :modelValue="msg.hotkey"
                  @update:modelValue="store.updateMessage(gameId, groupId!, msg.id, { hotkey: $event })"
                  :placeholder="t('hotkey.setHotkey')"
                  :gameId="gameId"
                  :msgId="msg.id"
                />
                <div class="msg-ops">
                  <button class="op-btn" @click="startEditMsg(msg.id, msg.content)">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                  </button>
                  <button class="op-btn danger" @click="handleDeleteMsg(msg.id)">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                  </button>
                </div>
              </template>

              <template v-else>
                <input
                  v-model="editMsgContent"
                  class="form-input msg-input"
                  @keyup.enter="saveMsg(msg.id)"
                  @keyup.escape="editingMsgId = null"
                  autofocus
                />
                <div class="msg-ops show">
                  <button class="op-btn confirm" @click="saveMsg(msg.id)">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  </button>
                  <button class="op-btn" @click="editingMsgId = null">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  </button>
                </div>
              </template>
            </div>
          </div>

          <div class="msg-empty" v-else>
            {{ t('groupModal.noMessages') }}
          </div>

          <!-- Add message input (always visible) -->
          <div class="add-msg-row">
            <input
              v-model="newMsgContent"
              class="form-input add-msg-input"
              :placeholder="t('groupModal.addMessagePlaceholder')"
              @keyup.enter="handleAddMsg"
            />
            <button class="add-msg-confirm" @click="handleAddMsg" :disabled="!newMsgContent.trim()">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            </button>
          </div>
        </div>
      </template>
    </div>
  </Modal>
</template>

<style scoped>
.modal-content {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.name-row {
  display: flex;
  gap: 8px;
}

.form-input {
  flex: 1;
  padding: 9px 14px;
  background: var(--color-bg-input);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  outline: none;
  font-size: 14px;
  transition: all var(--transition);
}

.form-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.15);
}

.save-name-btn {
  padding: 8px 16px;
  border-radius: var(--radius);
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
  flex-shrink: 0;
}

.save-name-btn:hover:not(:disabled) {
  color: var(--color-text);
  border-color: var(--color-text-secondary);
}

.save-name-btn.primary {
  background: var(--color-primary);
  color: #fff;
  border: none;
}

.save-name-btn.primary:hover:not(:disabled) {
  background: var(--color-primary-hover);
}

.save-name-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.divider {
  height: 1px;
  background: var(--color-border);
  margin: 20px 0;
}

/* Messages header */
.messages-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.msg-count {
  font-size: 11px;
  font-weight: 600;
  color: var(--color-text-muted);
  background: var(--color-bg-hover);
  padding: 1px 7px;
  border-radius: 10px;
}

/* Message list */
.msg-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  max-height: 320px;
  overflow-y: auto;
}

.msg-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: var(--radius-sm);
  transition: background var(--transition);
}

.msg-item:hover {
  background: var(--color-bg-hover);
}

.msg-num {
  font-size: 11px;
  color: var(--color-text-muted);
  width: 20px;
  text-align: center;
  flex-shrink: 0;
  font-variant-numeric: tabular-nums;
}

.msg-text {
  flex: 1;
  font-size: 13px;
  line-height: 1.4;
}

.msg-input {
  font-size: 13px;
  padding: 6px 10px;
}

.msg-ops {
  display: flex;
  gap: 2px;
  opacity: 0;
  transition: opacity 0.1s;
}

.msg-ops.show {
  opacity: 1;
}

.msg-item:hover .msg-ops {
  opacity: 1;
}

.op-btn {
  padding: 5px;
  border-radius: var(--radius-sm);
  color: var(--color-text-secondary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.op-btn:hover {
  background: var(--color-bg-hover);
  color: var(--color-text);
}

.op-btn.danger:hover {
  color: var(--color-danger);
  background: rgba(239, 68, 68, 0.1);
}

.op-btn.confirm:hover {
  color: var(--color-success);
  background: rgba(52, 211, 153, 0.1);
}

.msg-empty {
  text-align: center;
  padding: 20px;
  color: var(--color-text-muted);
  font-size: 13px;
}

/* Add message */
.add-msg-row {
  display: flex;
  gap: 8px;
  margin-top: 4px;
}

.add-msg-input {
  font-size: 13px;
}

.add-msg-confirm {
  padding: 8px 12px;
  background: var(--color-primary);
  color: #fff;
  border-radius: var(--radius);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.add-msg-confirm:hover:not(:disabled) {
  background: var(--color-primary-hover);
}

.add-msg-confirm:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
</style>

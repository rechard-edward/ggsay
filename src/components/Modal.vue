<script setup lang="ts">
defineProps<{
  title: string;
}>();

const emit = defineEmits<{
  close: [];
}>();

function onOverlay(e: MouseEvent) {
  if (e.target === e.currentTarget) emit("close");
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div class="modal-overlay" @mousedown="onOverlay">
        <div class="modal-container">
          <div class="modal-header">
            <h2 class="modal-title">{{ title }}</h2>
            <button class="modal-close" @click="emit('close')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </div>
          <div class="modal-body">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  width: 520px;
  max-width: calc(100vw - 48px);
  max-height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.4);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 0;
}

.modal-title {
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.modal-close {
  color: var(--color-text-muted);
  padding: 6px;
  border-radius: var(--radius-sm);
}

.modal-close:hover {
  color: var(--color-text);
  background: var(--color-bg-hover);
}

.modal-body {
  padding: 20px 24px 24px;
  overflow-y: auto;
  flex: 1;
}

/* Transition */
.modal-enter-active {
  transition: all 200ms ease-out;
}

.modal-leave-active {
  transition: all 150ms ease-in;
}

.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container {
  transform: scale(0.96) translateY(8px);
  opacity: 0;
}

.modal-leave-to .modal-container {
  transform: scale(0.96) translateY(8px);
  opacity: 0;
}

.modal-enter-active .modal-container {
  transition: all 200ms ease-out;
}

.modal-leave-active .modal-container {
  transition: all 150ms ease-in;
}
</style>

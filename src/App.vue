<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import Sidebar from "./components/Sidebar.vue";
import { useGamesStore } from "./stores/games";
import { listen, type UnlistenFn } from "@tauri-apps/api/event";

const store = useGamesStore();
let unlisten: UnlistenFn | null = null;

onMounted(async () => {
  try {
    unlisten = await listen<{ hotkey: string; pressed: boolean }>("hotkey-pressed", (e) => {
      store.handleHotkey(e.payload.hotkey, e.payload.pressed);
    });
  } catch (err) {
    console.error("failed to listen hotkey-pressed", err);
  }
});

onUnmounted(() => {
  if (unlisten) unlisten();
  store.stopListening();
});
</script>

<template>
  <div class="app-layout">
    <Sidebar />
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  height: 100vh;
  width: 100vw;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 32px;
}
</style>

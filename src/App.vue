<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import Sidebar from "./components/Sidebar.vue";
import { useGamesStore } from "./stores/games";
import { listen, type UnlistenFn } from "@tauri-apps/api/event";

const store = useGamesStore();
let unlisten: UnlistenFn | null = null;

function blockBrowserMouseNav(e: MouseEvent) {
  // Mouse side buttons (XButton1=3 Back, XButton2=4 Forward) otherwise
  // trigger WebView's built-in history navigation, which pops Vue Router.
  if (e.button === 3 || e.button === 4) e.preventDefault();
}

onMounted(async () => {
  window.addEventListener("mousedown", blockBrowserMouseNav);
  window.addEventListener("mouseup", blockBrowserMouseNav);
  window.addEventListener("auxclick", blockBrowserMouseNav);

  try {
    unlisten = await listen<{ hotkey: string; pressed: boolean }>("hotkey-pressed", (e) => {
      store.handleHotkey(e.payload.hotkey, e.payload.pressed);
    });
  } catch (err) {
    console.error("failed to listen hotkey-pressed", err);
  }
});

onUnmounted(() => {
  window.removeEventListener("mousedown", blockBrowserMouseNav);
  window.removeEventListener("mouseup", blockBrowserMouseNav);
  window.removeEventListener("auxclick", blockBrowserMouseNav);
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

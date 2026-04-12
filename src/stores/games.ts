import { defineStore } from "pinia";
import { ref, computed } from "vue";

export interface Message {
  id: string;
  content: string;
  hotkey: string;
}

export interface Group {
  id: string;
  name: string;
  messages: Message[];
}

export interface GameAction {
  preAction: string;
  postAction: string;
}

export interface Game {
  id: string;
  name: string;
  action: GameAction;
  triggerMode: "single" | "multi";
  singleHotkey: string;
  groups: Group[];
  activeGroupId: string | null;
}

export interface SendLog {
  time: string;
  content: string;
  hotkey: string;
}

function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export const useGamesStore = defineStore("games", () => {
  const games = ref<Game[]>([]);
  const activeGameId = ref<string | null>(null);
  const isListening = ref(false);
  const sendLogs = ref<SendLog[]>([]);

  const activeGame = computed(() =>
    games.value.find((g) => g.id === activeGameId.value) ?? null
  );

  const activeGroup = computed(() => {
    if (!activeGame.value || !activeGame.value.activeGroupId) return null;
    return (
      activeGame.value.groups.find(
        (g) => g.id === activeGame.value!.activeGroupId
      ) ?? null
    );
  });

  function addGame(name: string): Game {
    const game: Game = {
      id: genId(),
      name,
      action: { preAction: "Enter", postAction: "Enter" },
      triggerMode: "single",
      singleHotkey: "",
      groups: [],
      activeGroupId: null,
    };
    games.value.push(game);
    if (!activeGameId.value) activeGameId.value = game.id;
    return game;
  }

  function removeGame(id: string) {
    games.value = games.value.filter((g) => g.id !== id);
    if (activeGameId.value === id) {
      activeGameId.value = games.value[0]?.id ?? null;
    }
  }

  function updateGame(id: string, updates: Partial<Omit<Game, "id" | "groups">>) {
    const game = games.value.find((g) => g.id === id);
    if (game) Object.assign(game, updates);
  }

  function addGroup(gameId: string, name: string): Group | null {
    const game = games.value.find((g) => g.id === gameId);
    if (!game) return null;
    const group: Group = { id: genId(), name, messages: [] };
    game.groups.push(group);
    if (!game.activeGroupId) game.activeGroupId = group.id;
    return group;
  }

  function removeGroup(gameId: string, groupId: string) {
    const game = games.value.find((g) => g.id === gameId);
    if (!game) return;
    game.groups = game.groups.filter((g) => g.id !== groupId);
    if (game.activeGroupId === groupId) {
      game.activeGroupId = game.groups[0]?.id ?? null;
    }
  }

  function updateGroup(gameId: string, groupId: string, name: string) {
    const game = games.value.find((g) => g.id === gameId);
    if (!game) return;
    const group = game.groups.find((g) => g.id === groupId);
    if (group) group.name = name;
  }

  function setActiveGroup(gameId: string, groupId: string) {
    const game = games.value.find((g) => g.id === gameId);
    if (game) game.activeGroupId = groupId;
  }

  function addMessage(gameId: string, groupId: string, content: string, hotkey = ""): Message | null {
    const game = games.value.find((g) => g.id === gameId);
    if (!game) return null;
    const group = game.groups.find((g) => g.id === groupId);
    if (!group) return null;
    const msg: Message = { id: genId(), content, hotkey };
    group.messages.push(msg);
    return msg;
  }

  function removeMessage(gameId: string, groupId: string, msgId: string) {
    const game = games.value.find((g) => g.id === gameId);
    if (!game) return;
    const group = game.groups.find((g) => g.id === groupId);
    if (!group) return;
    group.messages = group.messages.filter((m) => m.id !== msgId);
  }

  function updateMessage(gameId: string, groupId: string, msgId: string, updates: Partial<Omit<Message, "id">>) {
    const game = games.value.find((g) => g.id === gameId);
    if (!game) return;
    const group = game.groups.find((g) => g.id === groupId);
    if (!group) return;
    const msg = group.messages.find((m) => m.id === msgId);
    if (msg) Object.assign(msg, updates);
  }

  function addSendLog(content: string, hotkey: string) {
    const now = new Date();
    const time = now.toLocaleTimeString("zh-CN", { hour12: false });
    sendLogs.value.unshift({ time, content, hotkey });
    if (sendLogs.value.length > 100) sendLogs.value.pop();
  }

  function toggleListening() {
    isListening.value = !isListening.value;
  }

  return {
    games,
    activeGameId,
    activeGame,
    activeGroup,
    isListening,
    sendLogs,
    addGame,
    removeGame,
    updateGame,
    addGroup,
    removeGroup,
    updateGroup,
    setActiveGroup,
    addMessage,
    removeMessage,
    updateMessage,
    addSendLog,
    toggleListening,
  };
});

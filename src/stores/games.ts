import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import { invoke } from "@tauri-apps/api/core";
import Database from "@tauri-apps/plugin-sql";

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

// Flat rows as stored in SQLite (snake_case columns mapped to camelCase here).
interface RawGame {
  id: string;
  name: string;
  actionPre: string;
  actionPost: string;
  triggerMode: "single" | "multi";
  singleHotkey: string;
  activeGroupId: string | null;
  sortOrder: number;
  updatedAt: number;
  deletedAt: number | null;
}
interface RawGroup {
  id: string;
  gameId: string;
  name: string;
  sortOrder: number;
  updatedAt: number;
  deletedAt: number | null;
}
interface RawMessage {
  id: string;
  groupId: string;
  content: string;
  hotkey: string;
  sortOrder: number;
  updatedAt: number;
  deletedAt: number | null;
}

const LEGACY_STORAGE_KEY = "ggsay.state.v1";
const STEP = 1000; // sort_order increment

function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function now(): number {
  return Date.now();
}

let db: Database | null = null;
async function getDb(): Promise<Database> {
  if (!db) db = await Database.load("sqlite:ggsay.db");
  return db;
}

export const useGamesStore = defineStore("games", () => {
  const rawGames = ref<RawGame[]>([]);
  const rawGroups = ref<RawGroup[]>([]);
  const rawMessages = ref<RawMessage[]>([]);
  const activeGameId = ref<string | null>(null);
  const isListening = ref(false);
  const sendLogs = ref<SendLog[]>([]);
  const initialized = ref(false);

  const shuffleQueues = new Map<string, string[]>();

  // ---------- Nested view (for UI) ----------
  const games = computed<Game[]>(() =>
    rawGames.value
      .filter((g) => g.deletedAt === null)
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((g) => ({
        id: g.id,
        name: g.name,
        action: { preAction: g.actionPre, postAction: g.actionPost },
        triggerMode: g.triggerMode,
        singleHotkey: g.singleHotkey,
        activeGroupId: g.activeGroupId,
        groups: rawGroups.value
          .filter((gr) => gr.gameId === g.id && gr.deletedAt === null)
          .slice()
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((gr) => ({
            id: gr.id,
            name: gr.name,
            messages: rawMessages.value
              .filter((m) => m.groupId === gr.id && m.deletedAt === null)
              .slice()
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((m) => ({ id: m.id, content: m.content, hotkey: m.hotkey })),
          })),
      }))
  );

  const activeGame = computed(
    () => games.value.find((g) => g.id === activeGameId.value) ?? null
  );

  const activeGroup = computed(() => {
    if (!activeGame.value || !activeGame.value.activeGroupId) return null;
    return (
      activeGame.value.groups.find(
        (g) => g.id === activeGame.value!.activeGroupId
      ) ?? null
    );
  });

  // ---------- Helpers ----------
  function nextSortOrder(filter: (r: { sortOrder: number; deletedAt: number | null }) => boolean, rows: Array<{ sortOrder: number; deletedAt: number | null }>): number {
    const live = rows.filter(filter);
    if (!live.length) return STEP;
    return Math.max(...live.map((r) => r.sortOrder)) + STEP;
  }

  async function setMeta(key: string, value: string) {
    const d = await getDb();
    await d.execute(
      "INSERT INTO meta(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value",
      [key, value]
    );
  }
  async function getMeta(key: string): Promise<string | null> {
    const d = await getDb();
    const rows = await d.select<{ value: string }[]>(
      "SELECT value FROM meta WHERE key=?",
      [key]
    );
    return rows[0]?.value ?? null;
  }

  // ---------- Init ----------
  async function init() {
    if (initialized.value) return;
    const d = await getDb();

    // Load all rows
    const gs = await d.select<Array<{
      id: string; name: string; action_pre: string; action_post: string;
      trigger_mode: "single" | "multi"; single_hotkey: string;
      active_group_id: string | null; sort_order: number;
      updated_at: number; deleted_at: number | null;
    }>>("SELECT * FROM games");
    rawGames.value = gs.map((r) => ({
      id: r.id, name: r.name, actionPre: r.action_pre, actionPost: r.action_post,
      triggerMode: r.trigger_mode, singleHotkey: r.single_hotkey,
      activeGroupId: r.active_group_id, sortOrder: r.sort_order,
      updatedAt: r.updated_at, deletedAt: r.deleted_at,
    }));

    const grs = await d.select<Array<{
      id: string; game_id: string; name: string; sort_order: number;
      updated_at: number; deleted_at: number | null;
    }>>("SELECT * FROM groups");
    rawGroups.value = grs.map((r) => ({
      id: r.id, gameId: r.game_id, name: r.name, sortOrder: r.sort_order,
      updatedAt: r.updated_at, deletedAt: r.deleted_at,
    }));

    const ms = await d.select<Array<{
      id: string; group_id: string; content: string; hotkey: string;
      sort_order: number; updated_at: number; deleted_at: number | null;
    }>>("SELECT * FROM messages");
    rawMessages.value = ms.map((r) => ({
      id: r.id, groupId: r.group_id, content: r.content, hotkey: r.hotkey,
      sortOrder: r.sort_order, updatedAt: r.updated_at, deletedAt: r.deleted_at,
    }));

    activeGameId.value = await getMeta("activeGameId");

    // Ensure deviceId/schemaVersion
    if (!(await getMeta("deviceId"))) {
      await setMeta("deviceId", crypto.randomUUID());
    }
    if (!(await getMeta("schemaVersion"))) {
      await setMeta("schemaVersion", "1");
    }

    // One-time migration from localStorage if DB empty
    if (rawGames.value.length === 0) {
      await migrateFromLocalStorage();
    }

    initialized.value = true;
  }

  async function migrateFromLocalStorage() {
    try {
      const raw = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as {
        games?: Array<{
          id: string; name: string;
          action?: { preAction: string; postAction: string };
          triggerMode?: "single" | "multi"; singleHotkey?: string;
          activeGroupId?: string | null;
          groups?: Array<{
            id: string; name: string;
            messages?: Array<{ id: string; content: string; hotkey?: string }>;
          }>;
        }>;
        activeGameId?: string | null;
      };
      if (!parsed.games?.length) return;

      const d = await getDb();
      const t = now();
      let gOrder = STEP;
      for (const g of parsed.games) {
        await d.execute(
          `INSERT INTO games(id,name,action_pre,action_post,trigger_mode,single_hotkey,active_group_id,sort_order,updated_at,deleted_at)
           VALUES(?,?,?,?,?,?,?,?,?,NULL)`,
          [
            g.id, g.name,
            g.action?.preAction ?? "Enter", g.action?.postAction ?? "Enter",
            g.triggerMode ?? "single", g.singleHotkey ?? "",
            g.activeGroupId ?? null, gOrder, t,
          ]
        );
        rawGames.value.push({
          id: g.id, name: g.name,
          actionPre: g.action?.preAction ?? "Enter", actionPost: g.action?.postAction ?? "Enter",
          triggerMode: g.triggerMode ?? "single", singleHotkey: g.singleHotkey ?? "",
          activeGroupId: g.activeGroupId ?? null, sortOrder: gOrder,
          updatedAt: t, deletedAt: null,
        });
        gOrder += STEP;

        let grOrder = STEP;
        for (const gr of g.groups ?? []) {
          await d.execute(
            `INSERT INTO groups(id,game_id,name,sort_order,updated_at,deleted_at) VALUES(?,?,?,?,?,NULL)`,
            [gr.id, g.id, gr.name, grOrder, t]
          );
          rawGroups.value.push({
            id: gr.id, gameId: g.id, name: gr.name,
            sortOrder: grOrder, updatedAt: t, deletedAt: null,
          });
          grOrder += STEP;

          let mOrder = STEP;
          for (const m of gr.messages ?? []) {
            await d.execute(
              `INSERT INTO messages(id,group_id,content,hotkey,sort_order,updated_at,deleted_at) VALUES(?,?,?,?,?,?,NULL)`,
              [m.id, gr.id, m.content, m.hotkey ?? "", mOrder, t]
            );
            rawMessages.value.push({
              id: m.id, groupId: gr.id, content: m.content, hotkey: m.hotkey ?? "",
              sortOrder: mOrder, updatedAt: t, deletedAt: null,
            });
            mOrder += STEP;
          }
        }
      }
      if (parsed.activeGameId) {
        activeGameId.value = parsed.activeGameId;
        await setMeta("activeGameId", parsed.activeGameId);
      }
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    } catch (e) {
      console.error("localStorage migration failed", e);
    }
  }

  // Persist activeGameId on change
  watch(activeGameId, async (v) => {
    if (!initialized.value) return;
    if (v) await setMeta("activeGameId", v);
    else {
      const d = await getDb();
      await d.execute("DELETE FROM meta WHERE key=?", ["activeGameId"]);
    }
  });

  // ---------- Mutations ----------
  async function addGame(name: string): Promise<Game> {
    const id = genId();
    const t = now();
    const sortOrder = nextSortOrder(
      (r) => r.deletedAt === null,
      rawGames.value
    );
    const row: RawGame = {
      id, name,
      actionPre: "Enter", actionPost: "Enter",
      triggerMode: "single", singleHotkey: "",
      activeGroupId: null, sortOrder,
      updatedAt: t, deletedAt: null,
    };
    const d = await getDb();
    await d.execute(
      `INSERT INTO games(id,name,action_pre,action_post,trigger_mode,single_hotkey,active_group_id,sort_order,updated_at,deleted_at)
       VALUES(?,?,?,?,?,?,?,?,?,NULL)`,
      [id, name, "Enter", "Enter", "single", "", null, sortOrder, t]
    );
    rawGames.value.push(row);
    if (!activeGameId.value) activeGameId.value = id;
    return {
      id, name, action: { preAction: "Enter", postAction: "Enter" },
      triggerMode: "single", singleHotkey: "", groups: [], activeGroupId: null,
    };
  }

  async function removeGame(id: string) {
    const t = now();
    const d = await getDb();
    await d.execute("UPDATE games SET deleted_at=?, updated_at=? WHERE id=?", [t, t, id]);
    const row = rawGames.value.find((g) => g.id === id);
    if (row) { row.deletedAt = t; row.updatedAt = t; }
    if (activeGameId.value === id) {
      activeGameId.value = rawGames.value.find((g) => g.deletedAt === null)?.id ?? null;
    }
  }

  async function updateGame(id: string, updates: Partial<Omit<Game, "id" | "groups">>) {
    const row = rawGames.value.find((g) => g.id === id);
    if (!row) return;
    const t = now();
    const sets: string[] = [];
    const vals: unknown[] = [];
    if (updates.name !== undefined) { row.name = updates.name; sets.push("name=?"); vals.push(updates.name); }
    if (updates.action !== undefined) {
      row.actionPre = updates.action.preAction;
      row.actionPost = updates.action.postAction;
      sets.push("action_pre=?", "action_post=?");
      vals.push(updates.action.preAction, updates.action.postAction);
    }
    if (updates.triggerMode !== undefined) { row.triggerMode = updates.triggerMode; sets.push("trigger_mode=?"); vals.push(updates.triggerMode); }
    if (updates.singleHotkey !== undefined) { row.singleHotkey = updates.singleHotkey; sets.push("single_hotkey=?"); vals.push(updates.singleHotkey); }
    if (updates.activeGroupId !== undefined) { row.activeGroupId = updates.activeGroupId; sets.push("active_group_id=?"); vals.push(updates.activeGroupId); }
    if (!sets.length) return;
    sets.push("updated_at=?"); vals.push(t);
    row.updatedAt = t;
    vals.push(id);
    const d = await getDb();
    await d.execute(`UPDATE games SET ${sets.join(",")} WHERE id=?`, vals);
  }

  async function addGroup(gameId: string, name: string): Promise<Group | null> {
    if (!rawGames.value.find((g) => g.id === gameId && g.deletedAt === null)) return null;
    const id = genId();
    const t = now();
    const sortOrder = nextSortOrder(
      (r) => r.deletedAt === null,
      rawGroups.value.filter((gr) => gr.gameId === gameId)
    );
    const row: RawGroup = { id, gameId, name, sortOrder, updatedAt: t, deletedAt: null };
    const d = await getDb();
    await d.execute(
      "INSERT INTO groups(id,game_id,name,sort_order,updated_at,deleted_at) VALUES(?,?,?,?,?,NULL)",
      [id, gameId, name, sortOrder, t]
    );
    rawGroups.value.push(row);
    // If game has no active group, set this one
    const gameRow = rawGames.value.find((g) => g.id === gameId);
    if (gameRow && !gameRow.activeGroupId) {
      await updateGame(gameId, { activeGroupId: id });
    }
    return { id, name, messages: [] };
  }

  async function removeGroup(gameId: string, groupId: string) {
    const t = now();
    const d = await getDb();
    await d.execute("UPDATE groups SET deleted_at=?, updated_at=? WHERE id=?", [t, t, groupId]);
    const row = rawGroups.value.find((g) => g.id === groupId);
    if (row) { row.deletedAt = t; row.updatedAt = t; }
    const gameRow = rawGames.value.find((g) => g.id === gameId);
    if (gameRow && gameRow.activeGroupId === groupId) {
      const fallback = rawGroups.value.find((gr) => gr.gameId === gameId && gr.deletedAt === null)?.id ?? null;
      await updateGame(gameId, { activeGroupId: fallback });
    }
  }

  async function updateGroup(_gameId: string, groupId: string, name: string) {
    const row = rawGroups.value.find((g) => g.id === groupId);
    if (!row) return;
    const t = now();
    row.name = name; row.updatedAt = t;
    const d = await getDb();
    await d.execute("UPDATE groups SET name=?, updated_at=? WHERE id=?", [name, t, groupId]);
  }

  async function setActiveGroup(gameId: string, groupId: string) {
    await updateGame(gameId, { activeGroupId: groupId });
    shuffleQueues.delete(groupId);
  }

  async function addMessage(_gameId: string, groupId: string, content: string, hotkey = ""): Promise<Message | null> {
    if (!rawGroups.value.find((g) => g.id === groupId && g.deletedAt === null)) return null;
    const id = genId();
    const t = now();
    const sortOrder = nextSortOrder(
      (r) => r.deletedAt === null,
      rawMessages.value.filter((m) => m.groupId === groupId)
    );
    const row: RawMessage = { id, groupId, content, hotkey, sortOrder, updatedAt: t, deletedAt: null };
    const d = await getDb();
    await d.execute(
      "INSERT INTO messages(id,group_id,content,hotkey,sort_order,updated_at,deleted_at) VALUES(?,?,?,?,?,?,NULL)",
      [id, groupId, content, hotkey, sortOrder, t]
    );
    rawMessages.value.push(row);
    shuffleQueues.delete(groupId);
    return { id, content, hotkey };
  }

  async function removeMessage(_gameId: string, groupId: string, msgId: string) {
    const t = now();
    const d = await getDb();
    await d.execute("UPDATE messages SET deleted_at=?, updated_at=? WHERE id=?", [t, t, msgId]);
    const row = rawMessages.value.find((m) => m.id === msgId);
    if (row) { row.deletedAt = t; row.updatedAt = t; }
    shuffleQueues.delete(groupId);
  }

  async function updateMessage(_gameId: string, _groupId: string, msgId: string, updates: Partial<Omit<Message, "id">>) {
    const row = rawMessages.value.find((m) => m.id === msgId);
    if (!row) return;
    const t = now();
    const sets: string[] = [];
    const vals: unknown[] = [];
    if (updates.content !== undefined) { row.content = updates.content; sets.push("content=?"); vals.push(updates.content); }
    if (updates.hotkey !== undefined) { row.hotkey = updates.hotkey; sets.push("hotkey=?"); vals.push(updates.hotkey); }
    if (!sets.length) return;
    sets.push("updated_at=?"); vals.push(t);
    row.updatedAt = t;
    vals.push(msgId);
    const d = await getDb();
    await d.execute(`UPDATE messages SET ${sets.join(",")} WHERE id=?`, vals);
  }

  function addSendLog(content: string, hotkey: string) {
    const n = new Date();
    const time = n.toLocaleTimeString("zh-CN", { hour12: false });
    sendLogs.value.unshift({ time, content, hotkey });
    if (sendLogs.value.length > 100) sendLogs.value.pop();
  }

  // ---------- Hotkey handling ----------
  function shuffle<T>(arr: T[]): T[] {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function pickShuffled(group: Group): Message | null {
    if (!group.messages.length) return null;
    let queue = shuffleQueues.get(group.id);
    if (!queue || queue.length === 0) {
      queue = shuffle(group.messages.map((m) => m.id));
      shuffleQueues.set(group.id, queue);
    }
    const id = queue.shift()!;
    return group.messages.find((m) => m.id === id) ?? group.messages[0];
  }

  function collectActiveHotkeys(): string[] {
    const keys: string[] = [];
    const game = activeGame.value;
    if (!game) return keys;
    const group = activeGroup.value;
    if (!group) return keys;
    if (game.triggerMode === "single") {
      if (game.singleHotkey) keys.push(game.singleHotkey);
    } else {
      for (const m of group.messages) if (m.hotkey) keys.push(m.hotkey);
    }
    return [...new Set(keys)];
  }

  const holdingHotkeys = new Set<string>();
  const REPEAT_GAP_MS = 150;

  async function sendOnceFor(hotkey: string): Promise<boolean> {
    const game = activeGame.value;
    const group = activeGroup.value;
    if (!game || !group) return false;
    let msg: Message | null = null;
    if (game.triggerMode === "single" && hotkey === game.singleHotkey) {
      msg = pickShuffled(group);
    } else if (game.triggerMode === "multi") {
      msg = group.messages.find((m) => m.hotkey === hotkey) ?? null;
    }
    if (!msg) return false;
    try {
      await invoke("send_message", {
        content: msg.content,
        preAction: game.action.preAction,
        postAction: game.action.postAction,
      });
      addSendLog(msg.content, hotkey);
      return true;
    } catch (e) {
      console.error("send_message failed", e);
      return false;
    }
  }

  async function runHoldLoop(hotkey: string) {
    while (holdingHotkeys.has(hotkey) && isListening.value) {
      const ok = await sendOnceFor(hotkey);
      if (!ok) break;
      if (!holdingHotkeys.has(hotkey) || !isListening.value) break;
      await new Promise((r) => setTimeout(r, REPEAT_GAP_MS));
    }
    holdingHotkeys.delete(hotkey);
  }

  async function handleHotkey(hotkey: string, pressed: boolean) {
    if (!isListening.value) return;
    if (pressed) {
      // Ignore OS key-repeat presses while we're already holding.
      if (holdingHotkeys.has(hotkey)) return;
      holdingHotkeys.add(hotkey);
      runHoldLoop(hotkey);
    } else {
      holdingHotkeys.delete(hotkey);
    }
  }

  async function startListening(): Promise<string | null> {
    const keys = collectActiveHotkeys();
    if (!keys.length) return "no-hotkeys";
    try {
      await invoke("register_hotkeys", { hotkeys: keys });
      isListening.value = true;
      return null;
    } catch (e) {
      console.error("register failed", e);
      return String(e);
    }
  }

  async function stopListening(): Promise<void> {
    try {
      await invoke("unregister_all_hotkeys");
    } catch (e) {
      console.error("unregister failed", e);
    }
    isListening.value = false;
    holdingHotkeys.clear();
  }

  async function toggleListening(): Promise<string | null> {
    if (isListening.value) { await stopListening(); return null; }
    return startListening();
  }

  async function pauseListening(): Promise<void> {
    // Always unregister so stale OS-level shortcuts don't swallow keydown
    // events during recording (even if isListening was flipped off already).
    try { await invoke("unregister_all_hotkeys"); }
    catch (e) { console.error("pause failed", e); }
  }

  async function resumeListening(): Promise<void> {
    if (!isListening.value) return;
    const keys = collectActiveHotkeys();
    if (!keys.length) {
      try { await invoke("unregister_all_hotkeys"); } catch {}
      isListening.value = false;
      return;
    }
    try { await invoke("register_hotkeys", { hotkeys: keys }); }
    catch (e) { console.error("resume failed", e); isListening.value = false; }
  }

  const activeHotkeysSignature = computed(() => {
    const g = activeGame.value;
    if (!g) return "";
    if (g.triggerMode === "single") return `s|${g.id}|${g.singleHotkey}`;
    const grp = activeGroup.value;
    if (!grp) return `m|${g.id}|-`;
    return `m|${g.id}|${grp.id}|` + grp.messages.map((m) => m.hotkey).join(",");
  });

  watch(activeHotkeysSignature, async () => {
    if (isListening.value) await resumeListening();
  });

  return {
    games,
    activeGameId,
    activeGame,
    activeGroup,
    isListening,
    sendLogs,
    initialized,
    init,
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
    startListening,
    stopListening,
    pauseListening,
    resumeListening,
    handleHotkey,
  };
});

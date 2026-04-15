export default {
  sidebar: {
    dashboard: "Dashboard",
    games: "Games",
    settings: "Settings",
  },

  dashboard: {
    title: "Dashboard",
    listening: "Listening",
    stopped: "Stopped",
    game: "Game",
    group: "Group",
    mode: "Mode",
    singleMode: "Single Key",
    multiMode: "Multi Hotkey",
    startListening: "▶ Start",
    stopListening: "■ Stop",
    cannotStart: "Please configure a game and group first",
    noGroupSelected: "Please select a group",
    noHotkey: "Please set a trigger hotkey first",
    sendLog: "Send Log",
    noLogs: "No send logs yet",
    noGames: "No games configured yet",
    goToGames: "Go to Games →",
    selectGame: "Select Game",
    selectGroup: "Select Group",
  },

  games: {
    title: "Games",
    addGame: "New Game",
    gameName: "Game Name",
    groups: "groups",
    messages: "messages",
    edit: "Edit",
    noGames: "No games configured yet",
    noGamesHint: "Click \"New Game\" to start",
    confirm: "OK",
    cancel: "Cancel",
  },

  gameDetail: {
    back: "← Back",
    deleteGame: "Delete Game",
    deleteGameConfirm: "Delete game \"{name}\"?",

    actionConfig: "Action Config",
    actionDesc: "Key sequence: Pre-action → Paste message → Post-action",
    preAction: "Before",
    postAction: "After",
    pasteStep: "Paste",
    optional: "Optional",
    preActionHint: "Key pressed before sending, e.g. Enter to open chat. Leave empty to skip",
    postActionHint: "Key pressed after pasting, e.g. Enter to send. Leave empty to skip",
    actionTip: "💡 Most games:",
    actionTipExample: "\"Before: Enter\" opens the chat box, the message is pasted, then \"After: Enter\" sends it. If the chat is already open, leave \"Before\" empty.",
    preActionPlaceholder: "None, click to set",
    postActionPlaceholder: "None, click to set",

    triggerMode: "Trigger Mode",
    singleMode: "Single Key Mode",
    singleModeDesc: "Press one hotkey to send a random message from the active group (shuffle, no repeat)",
    multiMode: "Multi Hotkey Mode",
    multiModeDesc: "Each message has its own hotkey, press to send that specific message",
    triggerHotkey: "Trigger Hotkey",

    groupManagement: "Groups",
    addGroup: "New Group",
    groupName: "Group Name",
    rename: "Rename",
    delete: "Delete",
    deleteGroupConfirm: "Delete group \"{name}\"?",
    noGroups: "No groups yet. Click \"New Group\" to start",

    addMessage: "+ Add Message",
    messageContent: "Message content",

    gameNotFound: "Game not found",
    backToGames: "Back to Games",
  },

  hotkey: {
    clickToSet: "Click to set hotkey",
    recording: "Press any key... (Esc to cancel)",
    setHotkey: "Set hotkey",
    conflict: "Conflict: already used by \"{label}\"",
    retry: "Retry",
  },

  groupModal: {
    newGroup: "New Group",
    editGroup: "Edit Group",
    groupName: "Group Name",
    groupNamePlaceholder: "Enter group name",
    save: "Save",
    create: "Create",
    messages: "Messages",
    noMessages: "No messages yet. Add below",
    addMessagePlaceholder: "Type message content, press Enter to add",
  },

  settings: {
    title: "Settings",
    language: "Language",

    general: "General",
    autoStart: "Start on boot",
    minimizeToTray: "Minimize to system tray",
    closeToMinimize: "Minimize on close",

    send: "Sending",
    restoreClipboard: "Restore clipboard after send",
    sendDelay: "Send delay (ms)",

    about: "About",
    version: "Version",
  },
};

export default {
  sidebar: { dashboard: "控制台", games: "遊戲", settings: "設定" },

  dashboard: {
    title: "控制台", listening: "監聽中", stopped: "已停止",
    game: "遊戲", group: "分組", mode: "模式",
    singleMode: "單鍵模式", multiMode: "多熱鍵模式",
    startListening: "▶ 開始監聽", stopListening: "■ 停止監聽",
    cannotStart: "請先設定遊戲和分組",
    noGroupSelected: "請選擇一個分組",
    noHotkey: "請先設定觸發熱鍵",
    sendLog: "發送紀錄", noLogs: "暫無發送紀錄",
    noGames: "還沒有設定任何遊戲",
    goToGames: "前往遊戲管理 →",
    selectGame: "選擇遊戲", selectGroup: "選擇分組",
  },

  games: {
    title: "遊戲管理", addGame: "新增遊戲", gameName: "遊戲名稱",
    groups: "個分組", messages: "條訊息", edit: "編輯",
    noGames: "還沒有設定任何遊戲",
    noGamesHint: '點擊「新增遊戲」開始',
    confirm: "確定", cancel: "取消",
  },

  gameDetail: {
    back: "← 返回", deleteGame: "刪除遊戲",
    deleteGameConfirm: "確定刪除遊戲「{name}」？",

    actionConfig: "動作設定",
    actionDesc: "發送訊息時的按鍵序列：前置動作 → 貼上訊息內容 → 後置動作",
    preAction: "發送前", postAction: "發送後", pasteStep: "貼上",
    optional: "可選",
    preActionHint: "發送訊息前按下的鍵，如按 Enter 開啟遊戲聊天框。留空則跳過",
    postActionHint: "貼上訊息後按下的鍵，如按 Enter 確認發送。留空則跳過",
    actionTip: "💡 大多數遊戲：",
    actionTipExample: "「發送前 Enter」開啟聊天框，貼上訊息內容，再「發送後 Enter」發送。如果遊戲聊天框已開啟則「發送前」留空即可。",
    preActionPlaceholder: "無，點擊設定",
    postActionPlaceholder: "無，點擊設定",

    triggerMode: "觸發模式",
    singleMode: "單鍵模式",
    singleModeDesc: "按一個熱鍵，從目前分組中隨機抽取一條發送（不重複輪播）",
    multiMode: "多熱鍵模式",
    multiModeDesc: "每條訊息綁定獨立熱鍵，按對應鍵發送指定訊息",
    triggerHotkey: "觸發熱鍵",

    groupManagement: "分組管理", addGroup: "新增分組",
    groupName: "分組名稱", rename: "重新命名", delete: "刪除",
    deleteGroupConfirm: "確定刪除分組「{name}」？",
    noGroups: '暫無分組，點擊「新增分組」開始',

    addMessage: "+ 新增訊息", messageContent: "訊息內容",

    gameNotFound: "遊戲不存在", backToGames: "返回遊戲列表",
  },

  hotkey: {
    clickToSet: "點擊設定熱鍵",
    recording: "按下任意鍵... (Esc 取消)",
    setHotkey: "設定熱鍵",
    conflict: "熱鍵衝突：已被「{label}」使用",
    systemConflict: "此熱鍵已被其他程式或系統占用，請更換",
    blockedKey: "此按鍵不能單獨作為熱鍵 (Enter / Escape / Tab / Backspace 會干擾系統操作)",
    mouseNotSupported: "暫不支援滑鼠按鍵，請使用鍵盤",
    invalidActionKey: "此處僅支援 Enter / Tab / Space / Escape 單鍵",
    retry: "重新設定",
  },

  groupModal: {
    newGroup: "新增分組", editGroup: "編輯分組",
    groupName: "分組名稱", groupNamePlaceholder: "輸入分組名稱",
    save: "儲存", create: "建立",
    messages: "訊息列表", noMessages: "暫無訊息，在下方新增",
    addMessagePlaceholder: "輸入訊息內容，按 Enter 新增",
  },

  settings: {
    title: "設定", language: "語言",
    general: "一般",
    autoStart: "開機自動啟動",
    minimizeToTray: "最小化到系統匣",
    closeToMinimize: "關閉視窗時最小化",
    send: "發送",
    restoreClipboard: "發送後還原剪貼簿",
    sendDelay: "發送間隔 (ms)",
    about: "關於", version: "版本",
  },
};

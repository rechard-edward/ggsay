export default {
  sidebar: { dashboard: "ダッシュボード", games: "ゲーム", settings: "設定" },

  dashboard: {
    title: "ダッシュボード", listening: "待機中", stopped: "停止中",
    game: "ゲーム", group: "グループ", mode: "モード",
    singleMode: "シングルキー", multiMode: "マルチホットキー",
    startListening: "▶ 開始", stopListening: "■ 停止",
    cannotStart: "先にゲームとグループを設定してください",
    noGroupSelected: "グループを選択してください",
    noHotkey: "トリガーキーを設定してください",
    sendLog: "送信履歴", noLogs: "送信履歴はまだありません",
    noGames: "ゲームが登録されていません",
    goToGames: "ゲーム管理へ →",
    selectGame: "ゲームを選択", selectGroup: "グループを選択",
  },

  games: {
    title: "ゲーム管理", addGame: "新規ゲーム", gameName: "ゲーム名",
    groups: "グループ", messages: "メッセージ", edit: "編集",
    noGames: "ゲームが登録されていません",
    noGamesHint: "「新規ゲーム」をクリックして開始",
    confirm: "OK", cancel: "キャンセル",
  },

  gameDetail: {
    back: "← 戻る", deleteGame: "ゲームを削除",
    deleteGameConfirm: "ゲーム「{name}」を削除しますか？",

    actionConfig: "アクション設定",
    actionDesc: "送信時のキー手順：前アクション → 貼り付け → 後アクション",
    preAction: "送信前", postAction: "送信後", pasteStep: "貼り付け",
    optional: "任意",
    preActionHint: "送信前に押すキー。例：Enter でチャットを開く。空欄でスキップ",
    postActionHint: "貼り付け後に押すキー。例：Enter で送信確定。空欄でスキップ",
    actionTip: "💡 多くのゲーム:",
    actionTipExample: "「送信前 Enter」でチャット欄を開き、メッセージを貼り付け、「送信後 Enter」で送信。チャットが既に開いている場合は「送信前」を空欄に。",
    preActionPlaceholder: "なし、クリックで設定",
    postActionPlaceholder: "なし、クリックで設定",

    triggerMode: "トリガーモード",
    singleMode: "シングルキーモード",
    singleModeDesc: "1つのホットキーで現在のグループからランダムに送信（重複なしシャッフル）",
    multiMode: "マルチホットキーモード",
    multiModeDesc: "各メッセージに個別のホットキーを割り当てて送信",
    triggerHotkey: "トリガーキー",

    groupManagement: "グループ", addGroup: "新規グループ",
    groupName: "グループ名", rename: "名前変更", delete: "削除",
    deleteGroupConfirm: "グループ「{name}」を削除しますか？",
    noGroups: "グループがありません。「新規グループ」で開始",

    addMessage: "+ メッセージ追加", messageContent: "メッセージ内容",

    gameNotFound: "ゲームが見つかりません", backToGames: "ゲーム一覧に戻る",
  },

  hotkey: {
    clickToSet: "クリックしてキーを設定",
    recording: "キーを押してください... (Esc でキャンセル)",
    setHotkey: "キー設定",
    conflict: "競合：「{label}」で使用中",
    retry: "再設定",
  },

  groupModal: {
    newGroup: "新規グループ", editGroup: "グループ編集",
    groupName: "グループ名", groupNamePlaceholder: "グループ名を入力",
    save: "保存", create: "作成",
    messages: "メッセージ一覧", noMessages: "メッセージなし。下から追加",
    addMessagePlaceholder: "内容を入力して Enter で追加",
  },

  settings: {
    title: "設定", language: "言語",
    general: "一般",
    autoStart: "起動時に自動実行",
    minimizeToTray: "システムトレイに最小化",
    closeToMinimize: "閉じるボタンで最小化",
    send: "送信",
    restoreClipboard: "送信後にクリップボードを復元",
    sendDelay: "送信間隔 (ms)",
    about: "情報", version: "バージョン",
  },
};

export default {
  // Sidebar
  sidebar: {
    dashboard: "控制台",
    games: "游戏",
    settings: "设置",
  },

  // Dashboard
  dashboard: {
    title: "控制台",
    listening: "监听中",
    stopped: "已停止",
    game: "游戏",
    group: "分组",
    mode: "模式",
    singleMode: "单键模式",
    multiMode: "多热键模式",
    startListening: "▶ 开始监听",
    stopListening: "■ 停止监听",
    cannotStart: "请先配置游戏和分组",
    noGroupSelected: "请选择一个分组",
    noHotkey: "请先设置触发热键",
    sendLog: "发送记录",
    noLogs: "暂无发送记录",
    noGames: "还没有配置任何游戏",
    goToGames: "前往游戏管理 →",
    selectGame: "选择游戏",
    selectGroup: "选择分组",
  },

  // Games
  games: {
    title: "游戏管理",
    addGame: "新建游戏",
    gameName: "游戏名称",
    groups: "个分组",
    messages: "条消息",
    edit: "编辑",
    noGames: "还没有配置任何游戏",
    noGamesHint: '点击「新建游戏」开始',
    confirm: "确定",
    cancel: "取消",
  },

  // Game Detail
  gameDetail: {
    back: "← 返回",
    deleteGame: "删除游戏",
    deleteGameConfirm: "确定删除游戏「{name}」？",

    // Action config
    actionConfig: "动作配置",
    actionDesc: "发送消息时的按键序列：前置动作 → 粘贴消息内容 → 后置动作",
    preAction: "发送前",
    postAction: "发送后",
    pasteStep: "粘贴",
    optional: "可选",
    preActionHint: "发送消息前按下的键，如按 Enter 打开游戏聊天框。留空则跳过",
    postActionHint: "粘贴消息后按下的键，如按 Enter 确认发送。留空则跳过",
    actionTip: "💡 大多数游戏：",
    actionTipExample: "「发送前 Enter」打开聊天框，粘贴消息内容，再「发送后 Enter」发送。如果游戏聊天框已打开则「发送前」留空即可。",
    preActionPlaceholder: "无，点击设置",
    postActionPlaceholder: "无，点击设置",

    // Trigger mode
    triggerMode: "触发模式",
    singleMode: "单键模式",
    singleModeDesc: "按一个热键，从当前分组中随机抽取一条发送（不重复轮播）",
    multiMode: "多热键模式",
    multiModeDesc: "每条消息绑定独立热键，按对应键发送指定消息",
    triggerHotkey: "触发热键",

    // Groups
    groupManagement: "分组管理",
    addGroup: "新建分组",
    groupName: "分组名称",
    rename: "重命名",
    delete: "删除",
    deleteGroupConfirm: "确定删除分组「{name}」？",
    noGroups: '暂无分组，点击「新建分组」开始',

    // Messages
    addMessage: "+ 添加消息",
    messageContent: "消息内容",

    // Not found
    gameNotFound: "游戏不存在",
    backToGames: "返回游戏列表",
  },

  // Hotkey input
  hotkey: {
    clickToSet: "点击设置热键",
    recording: "按下任意键... (Esc 取消)",
    setHotkey: "设置热键",
    conflict: "热键冲突：已被「{label}」使用",
    retry: "重新设置",
  },

  // Group Modal
  groupModal: {
    newGroup: "新建分组",
    editGroup: "编辑分组",
    groupName: "分组名称",
    groupNamePlaceholder: "输入分组名称",
    save: "保存",
    create: "创建",
    messages: "消息列表",
    noMessages: "暂无消息，在下方添加",
    addMessagePlaceholder: "输入消息内容，按回车添加",
  },

  // Settings
  settings: {
    title: "设置",
    language: "语言",

    general: "通用",
    autoStart: "开机自启动",
    minimizeToTray: "最小化到系统托盘",
    closeToMinimize: "关闭窗口时最小化",

    send: "发送",
    restoreClipboard: "发送后恢复剪贴板",
    sendDelay: "发送间隔 (ms)",

    about: "关于",
    version: "版本",
  },
};

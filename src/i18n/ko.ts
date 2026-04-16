export default {
  sidebar: { dashboard: "대시보드", games: "게임", settings: "설정" },

  dashboard: {
    title: "대시보드", listening: "감지 중", stopped: "중지됨",
    game: "게임", group: "그룹", mode: "모드",
    singleMode: "단일 키", multiMode: "다중 단축키",
    startListening: "▶ 시작", stopListening: "■ 중지",
    cannotStart: "먼저 게임과 그룹을 설정하세요",
    noGroupSelected: "그룹을 선택하세요",
    noHotkey: "트리거 키를 먼저 설정하세요",
    sendLog: "전송 기록", noLogs: "전송 기록이 없습니다",
    noGames: "등록된 게임이 없습니다",
    goToGames: "게임 관리로 →",
    selectGame: "게임 선택", selectGroup: "그룹 선택",
  },

  games: {
    title: "게임 관리", addGame: "새 게임", gameName: "게임 이름",
    groups: "그룹", messages: "메시지", edit: "편집",
    noGames: "등록된 게임이 없습니다",
    noGamesHint: "\"새 게임\"을 클릭해 시작하세요",
    confirm: "확인", cancel: "취소",
  },

  gameDetail: {
    back: "← 뒤로", deleteGame: "게임 삭제",
    deleteGameConfirm: "게임 \"{name}\"을(를) 삭제할까요?",

    actionConfig: "동작 설정",
    actionDesc: "전송 시 키 순서: 전처리 → 메시지 붙여넣기 → 후처리",
    preAction: "전송 전", postAction: "전송 후", pasteStep: "붙여넣기",
    optional: "선택",
    preActionHint: "전송 전 누를 키. 예: Enter 로 채팅 열기. 비우면 건너뜀",
    postActionHint: "붙여넣기 후 누를 키. 예: Enter 로 전송. 비우면 건너뜀",
    actionTip: "💡 대부분의 게임:",
    actionTipExample: "\"전송 전 Enter\" 로 채팅창 열기, 메시지 붙여넣기, \"전송 후 Enter\" 로 전송. 채팅창이 이미 열려있다면 \"전송 전\"을 비워두세요.",
    preActionPlaceholder: "없음, 클릭해 설정",
    postActionPlaceholder: "없음, 클릭해 설정",

    triggerMode: "트리거 모드",
    singleMode: "단일 키 모드",
    singleModeDesc: "하나의 단축키로 현재 그룹에서 무작위 전송 (셔플, 반복 없음)",
    multiMode: "다중 단축키 모드",
    multiModeDesc: "각 메시지에 개별 단축키 배정",
    triggerHotkey: "트리거 단축키",

    groupManagement: "그룹", addGroup: "새 그룹",
    groupName: "그룹 이름", rename: "이름 변경", delete: "삭제",
    deleteGroupConfirm: "그룹 \"{name}\"을(를) 삭제할까요?",
    noGroups: "그룹이 없습니다. \"새 그룹\"으로 시작",

    addMessage: "+ 메시지 추가", messageContent: "메시지 내용",

    gameNotFound: "게임을 찾을 수 없음", backToGames: "게임 목록으로",
  },

  hotkey: {
    clickToSet: "클릭해 단축키 설정",
    recording: "아무 키나 누르세요... (Esc 취소)",
    setHotkey: "단축키 설정",
    conflict: "충돌: \"{label}\"에서 사용 중",
    systemConflict: "이 단축키는 다른 앱 또는 시스템에서 이미 사용 중입니다",
    blockedKey: "이 키는 단독으로 사용할 수 없습니다 (Enter / Escape / Tab / Backspace 는 OS 조작을 방해함)",
    mouseNotSupported: "마우스 버튼은 아직 지원되지 않습니다 — 키보드를 사용하세요",
    invalidActionKey: "여기서는 Enter / Tab / Space / Escape 만 사용할 수 있습니다",
    retry: "다시 설정",
  },

  groupModal: {
    newGroup: "새 그룹", editGroup: "그룹 편집",
    groupName: "그룹 이름", groupNamePlaceholder: "그룹 이름 입력",
    save: "저장", create: "생성",
    messages: "메시지", noMessages: "메시지 없음. 아래에서 추가",
    addMessagePlaceholder: "내용 입력 후 Enter 로 추가",
  },

  settings: {
    title: "설정", language: "언어",
    general: "일반",
    autoStart: "시작 시 자동 실행",
    minimizeToTray: "시스템 트레이로 최소화",
    closeToMinimize: "닫기 시 최소화",
    send: "전송",
    restoreClipboard: "전송 후 클립보드 복원",
    sendDelay: "전송 간격 (ms)",
    about: "정보", version: "버전",
  },
};

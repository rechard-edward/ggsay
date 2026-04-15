export default {
  sidebar: { dashboard: "Panel", games: "Juegos", settings: "Ajustes" },

  dashboard: {
    title: "Panel", listening: "Escuchando", stopped: "Detenido",
    game: "Juego", group: "Grupo", mode: "Modo",
    singleMode: "Una tecla", multiMode: "Multi atajo",
    startListening: "▶ Iniciar", stopListening: "■ Detener",
    cannotStart: "Configura primero un juego y un grupo",
    noGroupSelected: "Selecciona un grupo",
    noHotkey: "Configura una tecla de activación",
    sendLog: "Registro de envíos", noLogs: "Sin registros todavía",
    noGames: "Aún no hay juegos configurados",
    goToGames: "Ir a Juegos →",
    selectGame: "Seleccionar juego", selectGroup: "Seleccionar grupo",
  },

  games: {
    title: "Juegos", addGame: "Nuevo juego", gameName: "Nombre del juego",
    groups: "grupos", messages: "mensajes", edit: "Editar",
    noGames: "Aún no hay juegos configurados",
    noGamesHint: "Haz clic en \"Nuevo juego\" para empezar",
    confirm: "Aceptar", cancel: "Cancelar",
  },

  gameDetail: {
    back: "← Volver", deleteGame: "Eliminar juego",
    deleteGameConfirm: "¿Eliminar el juego \"{name}\"?",

    actionConfig: "Configuración de acción",
    actionDesc: "Secuencia: Pre-acción → Pegar mensaje → Post-acción",
    preAction: "Antes", postAction: "Después", pasteStep: "Pegar",
    optional: "Opcional",
    preActionHint: "Tecla antes de enviar, ej. Enter para abrir el chat. Vacío para omitir",
    postActionHint: "Tecla después de pegar, ej. Enter para enviar. Vacío para omitir",
    actionTip: "💡 Mayoría de juegos:",
    actionTipExample: "\"Antes: Enter\" abre el chat, se pega el mensaje, \"Después: Enter\" lo envía. Si el chat ya está abierto, deja \"Antes\" vacío.",
    preActionPlaceholder: "Ninguna, clic para configurar",
    postActionPlaceholder: "Ninguna, clic para configurar",

    triggerMode: "Modo de activación",
    singleMode: "Modo una tecla",
    singleModeDesc: "Pulsa una tecla para enviar un mensaje aleatorio del grupo activo (sin repetición)",
    multiMode: "Modo multi-atajo",
    multiModeDesc: "Cada mensaje tiene su propio atajo",
    triggerHotkey: "Tecla de activación",

    groupManagement: "Grupos", addGroup: "Nuevo grupo",
    groupName: "Nombre del grupo", rename: "Renombrar", delete: "Eliminar",
    deleteGroupConfirm: "¿Eliminar el grupo \"{name}\"?",
    noGroups: "Sin grupos. Haz clic en \"Nuevo grupo\" para empezar",

    addMessage: "+ Añadir mensaje", messageContent: "Contenido del mensaje",

    gameNotFound: "Juego no encontrado", backToGames: "Volver a Juegos",
  },

  hotkey: {
    clickToSet: "Clic para configurar tecla",
    recording: "Pulsa cualquier tecla... (Esc para cancelar)",
    setHotkey: "Configurar tecla",
    conflict: "Conflicto: ya usada por \"{label}\"",
    retry: "Reintentar",
  },

  groupModal: {
    newGroup: "Nuevo grupo", editGroup: "Editar grupo",
    groupName: "Nombre del grupo", groupNamePlaceholder: "Introduce el nombre",
    save: "Guardar", create: "Crear",
    messages: "Mensajes", noMessages: "Sin mensajes. Añade abajo",
    addMessagePlaceholder: "Escribe el mensaje y pulsa Enter",
  },

  settings: {
    title: "Ajustes", language: "Idioma",
    general: "General",
    autoStart: "Iniciar con el sistema",
    minimizeToTray: "Minimizar a la bandeja",
    closeToMinimize: "Minimizar al cerrar",
    send: "Envío",
    restoreClipboard: "Restaurar portapapeles tras enviar",
    sendDelay: "Retardo de envío (ms)",
    about: "Acerca de", version: "Versión",
  },
};

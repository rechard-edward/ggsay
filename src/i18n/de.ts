export default {
  sidebar: { dashboard: 'Dashboard', games: 'Spiele', settings: 'Einstellungen' },

  dashboard: {
    title: 'Dashboard', listening: 'Aktiv', stopped: 'Gestoppt',
    game: 'Spiel', group: 'Gruppe', mode: 'Modus',
    singleMode: 'Einzeltaste', multiMode: 'Multi-Hotkey',
    startListening: '▶ Starten', stopListening: '■ Stoppen',
    cannotStart: 'Bitte zuerst Spiel und Gruppe einrichten',
    noGroupSelected: 'Bitte eine Gruppe auswählen',
    noHotkey: 'Bitte zuerst Auslösetaste festlegen',
    sendLog: 'Sendeverlauf', noLogs: 'Noch keine Einträge',
    noGames: 'Keine Spiele eingerichtet',
    goToGames: 'Zur Spielverwaltung →',
    selectGame: 'Spiel wählen', selectGroup: 'Gruppe wählen',
  },

  games: {
    title: 'Spiele', addGame: 'Neues Spiel', gameName: 'Spielname',
    groups: 'Gruppen', messages: 'Nachrichten', edit: 'Bearbeiten',
    noGames: 'Keine Spiele eingerichtet',
    noGamesHint: 'Klicke „Neues Spiel“, um zu starten',
    confirm: 'OK', cancel: 'Abbrechen',
  },

  gameDetail: {
    back: '← Zurück', deleteGame: 'Spiel löschen',
    deleteGameConfirm: 'Spiel „{name}“ löschen?',

    actionConfig: 'Aktionskonfiguration',
    actionDesc: 'Tastenfolge: Vor-Aktion → Einfügen → Nach-Aktion',
    preAction: 'Vor', postAction: 'Nach', pasteStep: 'Einfügen',
    optional: 'Optional',
    preActionHint: 'Taste vor dem Senden, z. B. Enter zum Öffnen des Chats. Leer = überspringen',
    postActionHint: 'Taste nach dem Einfügen, z. B. Enter zum Senden. Leer = überspringen',
    actionTip: '💡 Die meisten Spiele:',
    actionTipExample: '„Vor: Enter“ öffnet den Chat, die Nachricht wird eingefügt, „Nach: Enter“ sendet sie. Wenn der Chat bereits offen ist, „Vor“ leer lassen.',
    preActionPlaceholder: 'Keine, zum Festlegen klicken',
    postActionPlaceholder: 'Keine, zum Festlegen klicken',

    triggerMode: 'Auslösemodus',
    singleMode: 'Einzeltasten-Modus',
    singleModeDesc: 'Eine Taste sendet eine zufällige Nachricht aus der aktiven Gruppe (ohne Wiederholung)',
    multiMode: 'Multi-Hotkey-Modus',
    multiModeDesc: 'Jede Nachricht hat ihren eigenen Hotkey',
    triggerHotkey: 'Auslösetaste',

    groupManagement: 'Gruppen', addGroup: 'Neue Gruppe',
    groupName: 'Gruppenname', rename: 'Umbenennen', delete: 'Löschen',
    deleteGroupConfirm: 'Gruppe „{name}“ löschen?',
    noGroups: 'Keine Gruppen. „Neue Gruppe“ klicken',

    addMessage: '+ Nachricht hinzufügen', messageContent: 'Nachrichteninhalt',

    gameNotFound: 'Spiel nicht gefunden', backToGames: 'Zurück zu Spielen',
  },

  hotkey: {
    clickToSet: 'Klicken, um Taste festzulegen',
    recording: 'Beliebige Taste drücken... (Esc zum Abbrechen)',
    setHotkey: 'Taste festlegen',
    conflict: 'Konflikt: bereits von „{label}” verwendet',
    systemConflict: 'Dieser Hotkey wird bereits von einer anderen App oder dem System verwendet',
    blockedKey: 'Diese Taste kann nicht alleine verwendet werden (Enter / Escape / Tab / Backspace würden Systemdialoge blockieren)',
    invalidActionKey: 'Hier ist nur Enter / Tab / Space / Escape erlaubt',
    retry: 'Erneut versuchen',
  },

  groupModal: {
    newGroup: 'Neue Gruppe', editGroup: 'Gruppe bearbeiten',
    groupName: 'Gruppenname', groupNamePlaceholder: 'Gruppenname eingeben',
    save: 'Speichern', create: 'Erstellen',
    messages: 'Nachrichten', noMessages: 'Keine Nachrichten. Unten hinzufügen',
    addMessagePlaceholder: 'Inhalt eingeben, mit Enter hinzufügen',
  },

  settings: {
    title: 'Einstellungen', language: 'Sprache',
    general: 'Allgemein',
    autoStart: 'Autostart beim Systemstart',
    minimizeToTray: 'In Infobereich minimieren',
    closeToMinimize: 'Beim Schließen minimieren',
    send: 'Senden',
    restoreClipboard: 'Zwischenablage nach Senden wiederherstellen',
    sendDelay: 'Sendeverzögerung (ms)',
    about: 'Info', version: 'Version',
  },
};

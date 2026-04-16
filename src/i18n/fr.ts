export default {
  sidebar: { dashboard: "Tableau de bord", games: "Jeux", settings: "Paramètres" },

  dashboard: {
    title: "Tableau de bord", listening: "À l'écoute", stopped: "Arrêté",
    game: "Jeu", group: "Groupe", mode: "Mode",
    singleMode: "Touche unique", multiMode: "Multi-raccourci",
    startListening: "▶ Démarrer", stopListening: "■ Arrêter",
    cannotStart: "Configurez d'abord un jeu et un groupe",
    noGroupSelected: "Sélectionnez un groupe",
    noHotkey: "Définissez d'abord une touche de déclenchement",
    sendLog: "Journal d'envoi", noLogs: "Aucun envoi",
    noGames: "Aucun jeu configuré",
    goToGames: "Aller aux Jeux →",
    selectGame: "Choisir un jeu", selectGroup: "Choisir un groupe",
  },

  games: {
    title: "Jeux", addGame: "Nouveau jeu", gameName: "Nom du jeu",
    groups: "groupes", messages: "messages", edit: "Modifier",
    noGames: "Aucun jeu configuré",
    noGamesHint: "Cliquez sur « Nouveau jeu » pour commencer",
    confirm: "OK", cancel: "Annuler",
  },

  gameDetail: {
    back: "← Retour", deleteGame: "Supprimer le jeu",
    deleteGameConfirm: "Supprimer le jeu « {name} » ?",

    actionConfig: "Configuration d'action",
    actionDesc: "Séquence : Pré-action → Coller → Post-action",
    preAction: "Avant", postAction: "Après", pasteStep: "Coller",
    optional: "Facultatif",
    preActionHint: "Touche avant l'envoi, ex. Entrée pour ouvrir le chat. Vide pour ignorer",
    postActionHint: "Touche après le collage, ex. Entrée pour envoyer. Vide pour ignorer",
    actionTip: "💡 La plupart des jeux :",
    actionTipExample: "« Avant : Entrée » ouvre le chat, le message est collé, « Après : Entrée » l'envoie. Si le chat est déjà ouvert, laissez « Avant » vide.",
    preActionPlaceholder: "Aucune, cliquer pour définir",
    postActionPlaceholder: "Aucune, cliquer pour définir",

    triggerMode: "Mode de déclenchement",
    singleMode: "Mode touche unique",
    singleModeDesc: "Une touche envoie un message aléatoire du groupe actif (sans répétition)",
    multiMode: "Mode multi-raccourci",
    multiModeDesc: "Chaque message a son propre raccourci",
    triggerHotkey: "Touche de déclenchement",

    groupManagement: "Groupes", addGroup: "Nouveau groupe",
    groupName: "Nom du groupe", rename: "Renommer", delete: "Supprimer",
    deleteGroupConfirm: "Supprimer le groupe « {name} » ?",
    noGroups: "Aucun groupe. Cliquez sur « Nouveau groupe »",

    addMessage: "+ Ajouter un message", messageContent: "Contenu du message",

    gameNotFound: "Jeu introuvable", backToGames: "Retour aux Jeux",
  },

  hotkey: {
    clickToSet: "Cliquer pour définir",
    recording: "Appuyez sur une touche... (Échap pour annuler)",
    setHotkey: "Définir la touche",
    conflict: "Conflit : déjà utilisée par « {label} »",
    systemConflict: "Ce raccourci est déjà utilisé par une autre app ou le système",
    blockedKey: "Cette touche ne peut pas être utilisée seule (Entrée / Échap / Tab / Retour arrière bloqueraient les dialogues système)",
    mouseNotSupported: "Les boutons de souris ne sont pas encore pris en charge — utilisez le clavier",
    invalidActionKey: "Seules Entrée / Tab / Espace / Échap sont autorisées ici",
    retry: "Réessayer",
  },

  groupModal: {
    newGroup: "Nouveau groupe", editGroup: "Modifier le groupe",
    groupName: "Nom du groupe", groupNamePlaceholder: "Entrez un nom",
    save: "Enregistrer", create: "Créer",
    messages: "Messages", noMessages: "Aucun message. Ajoutez ci-dessous",
    addMessagePlaceholder: "Tapez un message et appuyez sur Entrée",
  },

  settings: {
    title: "Paramètres", language: "Langue",
    general: "Général",
    autoStart: "Démarrer avec le système",
    minimizeToTray: "Réduire dans la barre d'état",
    closeToMinimize: "Réduire à la fermeture",
    send: "Envoi",
    restoreClipboard: "Restaurer le presse-papiers après envoi",
    sendDelay: "Délai d'envoi (ms)",
    about: "À propos", version: "Version",
  },
};

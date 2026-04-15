# GGSay

[<img src="https://flagcdn.com/16x12/cn.png" width="16" /> 简体中文](./README.zh-CN.md) · [<img src="https://flagcdn.com/16x12/tw.png" width="16" /> 繁體中文](./README.zh-TW.md) · [<img src="https://flagcdn.com/16x12/us.png" width="16" /> English](../README.md) · [<img src="https://flagcdn.com/16x12/jp.png" width="16" /> 日本語](./README.ja.md) · [<img src="https://flagcdn.com/16x12/kr.png" width="16" /> 한국어](./README.ko.md) · [<img src="https://flagcdn.com/16x12/es.png" width="16" /> Español](./README.es.md) · **<img src="https://flagcdn.com/16x12/fr.png" width="16" /> Français** · [<img src="https://flagcdn.com/16x12/de.png" width="16" /> Deutsch](./README.de.md)

---

Outil de bureau pour envoyer des messages prédéfinis en jeu d'un simple raccourci. Associez des touches, maintenez pour envoyer en continu, relâchez pour arrêter.

Construit avec Tauri + Vue 3 — installateur léger, démarrage rapide, performances natives. Windows pris en charge.

## ✨ Fonctionnalités

- **Raccourcis globaux** — déclenchement depuis n'importe quel jeu, sans changer de fenêtre
- **Deux modes de déclenchement**
  - Touche unique : un raccourci tire un message au hasard du groupe actif (mélange, sans répétition)
  - Multi-raccourci : chaque message a son propre raccourci
- **Maintenir pour répéter** — envoie tant que la touche est enfoncée, s'arrête dès le relâchement
- **Jeux / Groupes / Messages** — organisation à trois niveaux, changement de contexte en un clic
- **Actions avant / après** — touches configurables autour de l'envoi (ex. Entrée pour ouvrir/fermer le chat)
- **Détection automatique de langue** — suit la langue du système au premier lancement ; 8 langues
- **Barre d'état système** — réduit vers la barre à la fermeture, ne gêne pas le jeu
- **Lancement au démarrage** (optionnel)
- **Données locales** — configuration stockée en SQLite local

## 📸 Captures d'écran

> _À venir_

## 🚀 Installation

Téléchargez le dernier installateur **Windows x64** depuis [Releases](https://github.com/rechard-edward/ggsay/releases) :

- `ggsay_x.y.z_x64-setup.exe` — un installateur multilingue unique. L'assistant d'installation et l'application prennent en charge 8 langues (简体中文 / 繁體中文 / English / 日本語 / 한국어 / Español / Français / Deutsch) et détectent automatiquement la langue du système au premier lancement.

## 🎮 Utilisation

1. **Créer un jeu** : page Jeux → Nouveau jeu, saisissez un nom
2. **Configurer les actions avant / après** : la plupart des jeux utilisent Entrée pour ouvrir le chat + Entrée pour envoyer
3. **Créer des groupes et ajouter des messages** : organisez par scénario (ex. « Classé », « Décontracté »)
4. **Définir les raccourcis** :
   - Mode touche unique : un par jeu
   - Mode multi-raccourci : un par message
5. **Tableau de bord → Démarrer** : retournez en jeu et appuyez sur la touche

## 🛠️ Pile technique

- **Front-end** : Vue 3 + TypeScript + Pinia + Vue Router + vue-i18n
- **Shell bureau** : Tauri 2 (Rust)
- **Bundler** : Vite
- **Stockage local** : SQLite (`tauri-plugin-sql`)
- **Raccourcis globaux** : `tauri-plugin-global-shortcut`
- **Simulation de touches** : [enigo](https://github.com/enigo-rs/enigo)

## 🧑‍💻 Développement

Prérequis : Node.js 20+, pnpm, Rust toolchain, Visual Studio C++ Build Tools (Windows)

```bash
# Installer les dépendances
pnpm install

# Mode développement (hot reload)
pnpm tauri dev

# Build production + installateurs
pnpm tauri build
```

Artefacts :

- Binaire : `src-tauri/target/release/ggsay.exe`
- Installateur NSIS (multilingue) : `src-tauri/target/release/bundle/nsis/ggsay_x.y.z_x64-setup.exe`

## 📁 Structure du projet

```
ggsay-app/
├── src/                   # Front-end
│   ├── views/             # Pages
│   ├── components/        # Composants
│   ├── stores/            # Pinia (games / settings)
│   ├── i18n/              # Traductions
│   └── router/
├── src-tauri/             # Tauri / Rust
│   ├── src/lib.rs         # Raccourcis, simulation, barre d'état
│   ├── capabilities/      # Permissions
│   └── tauri.conf.json
└── docs/                  # READMEs traduits
```

## 🤝 Contribuer

Issues et PR bienvenus. Exécutez `pnpm tauri build` avant soumission pour vérifier que le projet compile.

## 📄 Licence

MIT License — voir [LICENSE](../LICENSE)

## 🔗 Liens

- Site : [ggsay.com](https://www.ggsay.com)
- Issues : [GitHub Issues](https://github.com/rechard-edward/ggsay/issues)

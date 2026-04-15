# GGSay

[<img src="https://flagcdn.com/16x12/cn.png" width="16" /> 简体中文](./README.zh-CN.md) · [<img src="https://flagcdn.com/16x12/tw.png" width="16" /> 繁體中文](./README.zh-TW.md) · [<img src="https://flagcdn.com/16x12/us.png" width="16" /> English](../README.md) · [<img src="https://flagcdn.com/16x12/jp.png" width="16" /> 日本語](./README.ja.md) · [<img src="https://flagcdn.com/16x12/kr.png" width="16" /> 한국어](./README.ko.md) · **<img src="https://flagcdn.com/16x12/es.png" width="16" /> Español** · [<img src="https://flagcdn.com/16x12/fr.png" width="16" /> Français](./README.fr.md) · [<img src="https://flagcdn.com/16x12/de.png" width="16" /> Deutsch](./README.de.md)

---

Herramienta de escritorio para enviar mensajes predefinidos en el juego con una sola tecla. Asigna atajos, mantén presionado para repetir, suelta para detener.

Creada con Tauri + Vue 3 — instalador pequeño, arranque rápido, rendimiento nativo. Compatible con Windows.

## ✨ Funcionalidades

- **Atajos globales** — activa desde cualquier juego sin cambiar de ventana
- **Dos modos de activación**
  - Tecla única: un atajo elige un mensaje aleatorio del grupo activo (barajado, sin repetir)
  - Multi-atajo: cada mensaje tiene su propio atajo para un control preciso
- **Mantener para repetir** — envía mientras mantienes la tecla, se detiene al soltarla
- **Juegos / Grupos / Mensajes** — organización en tres niveles, cambia de escenario con un clic
- **Pre / Post acciones** — teclas configurables antes y después del envío (p. ej. Enter para abrir/cerrar chat)
- **Detección automática de idioma** — sigue el idioma del sistema en el primer arranque; 8 idiomas
- **Bandeja del sistema** — minimiza a la bandeja al cerrar, no molesta al juego
- **Inicio automático** (opcional)
- **Datos locales** — configuración guardada en SQLite local

## 📸 Capturas

> _Próximamente_

## 🚀 Instalación

Descarga la última versión en [Releases](https://github.com/rechard-edward/ggsay/releases):

- **Windows**: `ggsay_x.y.z_x64-setup.exe` (instalador NSIS con asistente localizado en 8 idiomas)

## 🎮 Uso

1. **Crear un juego**: página Juegos → Nuevo juego, introduce un nombre
2. **Configurar pre / post acciones**: la mayoría de juegos usan Enter para abrir chat + Enter para enviar
3. **Crear grupos y añadir mensajes**: organiza por escenario (p. ej. "Competitivo", "Casual")
4. **Definir atajos**:
   - Modo tecla única: uno por juego
   - Modo multi-atajo: uno por mensaje
5. **Panel → Iniciar**: vuelve al juego y pulsa el atajo

## 🛠️ Stack técnico

- **Frontend**: Vue 3 + TypeScript + Pinia + Vue Router + vue-i18n
- **Shell de escritorio**: Tauri 2 (Rust)
- **Bundler**: Vite
- **Almacenamiento local**: SQLite (`tauri-plugin-sql`)
- **Atajos globales**: `tauri-plugin-global-shortcut`
- **Simulación de teclas**: [enigo](https://github.com/enigo-rs/enigo)

## 🧑‍💻 Desarrollo

Requisitos: Node.js 20+, pnpm, Rust toolchain, Visual Studio C++ Build Tools (Windows)

```bash
# Instalar dependencias
pnpm install

# Modo desarrollo (hot reload)
pnpm tauri dev

# Build de producción + instaladores
pnpm tauri build
```

Artefactos:

- Ejecutable: `src-tauri/target/release/ggsay.exe`
- Instalador NSIS: `src-tauri/target/release/bundle/nsis/ggsay_x.y.z_x64-setup.exe`
- Instalador MSI: `src-tauri/target/release/bundle/msi/ggsay_x.y.z_x64_en-US.msi`

Compilar solo un formato:

```bash
pnpm tauri build --bundles nsis   # solo NSIS
pnpm tauri build --bundles msi    # solo MSI
pnpm tauri build --bundles app    # solo binario
```

## 📁 Estructura del proyecto

```
ggsay-app/
├── src/                   # Frontend
│   ├── views/             # Páginas
│   ├── components/        # Componentes
│   ├── stores/            # Pinia (games / settings)
│   ├── i18n/              # Traducciones
│   └── router/
├── src-tauri/             # Tauri / Rust
│   ├── src/lib.rs         # Atajos, simulación, bandeja
│   ├── capabilities/      # Permisos
│   └── tauri.conf.json
└── docs/                  # READMEs traducidos
```

## 🤝 Contribuir

Issues y PRs bienvenidos. Ejecuta `pnpm tauri build` antes de enviar para verificar que compila.

## 📄 Licencia

MIT License — ver [LICENSE](../LICENSE)

## 🔗 Enlaces

- Web: [ggsay.com](https://www.ggsay.com)
- Issues: [GitHub Issues](https://github.com/rechard-edward/ggsay/issues)

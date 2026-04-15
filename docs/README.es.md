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

Descarga el último instalador de **Windows x64** desde [Releases](https://github.com/rechard-edward/ggsay/releases):

- `ggsay_x.y.z_x64-setup.exe` — un único instalador multilingüe. Tanto el asistente de instalación como la aplicación soportan 8 idiomas (简体中文 / 繁體中文 / English / 日本語 / 한국어 / Español / Français / Deutsch) y detectan automáticamente el idioma del sistema en el primer inicio.

### ⚠️ Aviso de primera instalación

La primera vez que ejecutes el instalador, **Windows SmartScreen puede mostrar una advertencia "Windows protegió su PC"**. Esto ocurre porque el instalador aún no está firmado con un certificado de firma de código de pago — normal en lanzamientos iniciales de código abierto. No es un virus. Para continuar: haz clic en **Más información** → **Ejecutar de todas formas**.

Tu antivirus también puede marcarlo. GGSay funciona **simulando pulsaciones de teclas** (Ctrl+V, Enter) para pegar y enviar mensajes dentro de los juegos — esa es la funcionalidad principal. Algunos antivirus tratan por defecto cualquier aplicación que sintetice entrada de teclado como sospechosa. El código fuente está totalmente abierto en este repositorio; puedes auditarlo o compilarlo tú mismo. Si tu antivirus bloquea la aplicación, añade `ggsay.exe` a su lista de exclusiones.

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
- Instalador NSIS (multilingüe): `src-tauri/target/release/bundle/nsis/ggsay_x.y.z_x64-setup.exe`

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

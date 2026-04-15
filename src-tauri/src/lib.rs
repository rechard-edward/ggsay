use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::{Mutex, RwLock};
use std::thread;
use std::time::Duration;

static SENDING: AtomicBool = AtomicBool::new(false);

struct SendingGuard;
impl Drop for SendingGuard {
    fn drop(&mut self) { SENDING.store(false, Ordering::Release); }
}

use enigo::{Direction, Enigo, Key, Keyboard, Settings};
use serde::{Deserialize, Serialize};
use tauri::{
    menu::{Menu, MenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    AppHandle, Emitter, Manager, State, WindowEvent,
};
use tauri_plugin_clipboard_manager::ClipboardExt;
use tauri_plugin_global_shortcut::{Code, GlobalShortcutExt, Modifiers, Shortcut, ShortcutState};
use tauri_plugin_sql::{Migration, MigrationKind};

#[derive(Debug, Clone, Serialize, Deserialize)]
struct AppSettings {
    close_to_minimize: bool,
    minimize_to_tray: bool,
    restore_clipboard: bool,
    send_delay_ms: u64,
}

impl Default for AppSettings {
    fn default() -> Self {
        Self {
            close_to_minimize: true,
            minimize_to_tray: true,
            restore_clipboard: true,
            send_delay_ms: 50,
        }
    }
}

struct SettingsState(RwLock<AppSettings>);

#[tauri::command]
fn update_settings(state: State<'_, SettingsState>, settings: AppSettings) -> Result<(), String> {
    *state.0.write().map_err(|e| e.to_string())? = settings;
    Ok(())
}

#[derive(Default)]
struct HotkeyMap {
    // hotkey string -> registered Shortcut
    map: Mutex<Vec<(String, Shortcut)>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct HotkeyEvent {
    hotkey: String,
    pressed: bool,
}

fn parse_action_key(s: &str) -> Option<Key> {
    match s.trim().to_lowercase().as_str() {
        "" | "none" => None,
        "enter" | "return" => Some(Key::Return),
        "tab" => Some(Key::Tab),
        "space" => Some(Key::Space),
        "escape" | "esc" => Some(Key::Escape),
        _ => None,
    }
}

fn press_key(enigo: &mut Enigo, key: Key) {
    let _ = enigo.key(key, Direction::Click);
}

/// Parse a frontend hotkey string like "Ctrl+Shift+A" into a Shortcut.
fn parse_shortcut(s: &str) -> Result<Shortcut, String> {
    let mut mods = Modifiers::empty();
    let mut code: Option<Code> = None;
    for raw in s.split('+') {
        let part = raw.trim();
        match part.to_lowercase().as_str() {
            "ctrl" | "control" => mods |= Modifiers::CONTROL,
            "alt" | "option" => mods |= Modifiers::ALT,
            "shift" => mods |= Modifiers::SHIFT,
            "meta" | "cmd" | "command" | "super" | "win" => mods |= Modifiers::SUPER,
            other => {
                code = Some(map_code(other).ok_or_else(|| format!("unknown key: {part}"))?);
            }
        }
    }
    let code = code.ok_or_else(|| format!("no main key in {s}"))?;
    Ok(Shortcut::new(Some(mods), code))
}

fn map_code(s: &str) -> Option<Code> {
    // s lowercased; single-char letters/digits, and named keys
    let up = s.to_uppercase();
    Some(match up.as_str() {
        "A" => Code::KeyA, "B" => Code::KeyB, "C" => Code::KeyC, "D" => Code::KeyD,
        "E" => Code::KeyE, "F" => Code::KeyF, "G" => Code::KeyG, "H" => Code::KeyH,
        "I" => Code::KeyI, "J" => Code::KeyJ, "K" => Code::KeyK, "L" => Code::KeyL,
        "M" => Code::KeyM, "N" => Code::KeyN, "O" => Code::KeyO, "P" => Code::KeyP,
        "Q" => Code::KeyQ, "R" => Code::KeyR, "S" => Code::KeyS, "T" => Code::KeyT,
        "U" => Code::KeyU, "V" => Code::KeyV, "W" => Code::KeyW, "X" => Code::KeyX,
        "Y" => Code::KeyY, "Z" => Code::KeyZ,
        "0" => Code::Digit0, "1" => Code::Digit1, "2" => Code::Digit2, "3" => Code::Digit3,
        "4" => Code::Digit4, "5" => Code::Digit5, "6" => Code::Digit6, "7" => Code::Digit7,
        "8" => Code::Digit8, "9" => Code::Digit9,
        "F1" => Code::F1, "F2" => Code::F2, "F3" => Code::F3, "F4" => Code::F4,
        "F5" => Code::F5, "F6" => Code::F6, "F7" => Code::F7, "F8" => Code::F8,
        "F9" => Code::F9, "F10" => Code::F10, "F11" => Code::F11, "F12" => Code::F12,
        "ENTER" | "RETURN" => Code::Enter,
        "TAB" => Code::Tab,
        "SPACE" | " " => Code::Space,
        "ESCAPE" | "ESC" => Code::Escape,
        "BACKSPACE" => Code::Backspace,
        "DELETE" | "DEL" => Code::Delete,
        "ARROWUP" | "UP" => Code::ArrowUp,
        "ARROWDOWN" | "DOWN" => Code::ArrowDown,
        "ARROWLEFT" | "LEFT" => Code::ArrowLeft,
        "ARROWRIGHT" | "RIGHT" => Code::ArrowRight,
        "`" | "BACKQUOTE" => Code::Backquote,
        "-" | "MINUS" => Code::Minus,
        "=" | "EQUAL" => Code::Equal,
        "[" => Code::BracketLeft,
        "]" => Code::BracketRight,
        "\\" => Code::Backslash,
        ";" => Code::Semicolon,
        "'" => Code::Quote,
        "," => Code::Comma,
        "." => Code::Period,
        "/" => Code::Slash,
        _ => return None,
    })
}

#[tauri::command]
async fn send_message(
    app: AppHandle,
    content: String,
    pre_action: String,
    post_action: String,
) -> Result<(), String> {
    if SENDING.swap(true, Ordering::AcqRel) {
        return Ok(());
    }
    let _guard = SendingGuard;

    let cfg = app.state::<SettingsState>().0.read().map_err(|e| e.to_string())?.clone();
    let delay = cfg.send_delay_ms.max(10);

    let prev = if cfg.restore_clipboard { app.clipboard().read_text().ok() } else { None };

    app.clipboard()
        .write_text(content.clone())
        .map_err(|e| e.to_string())?;

    thread::sleep(Duration::from_millis(delay));

    let pre = parse_action_key(&pre_action);
    let post = parse_action_key(&post_action);

    let res = tauri::async_runtime::spawn_blocking(move || -> Result<(), String> {
        let mut enigo = Enigo::new(&Settings::default()).map_err(|e| e.to_string())?;

        if let Some(k) = pre {
            press_key(&mut enigo, k);
            thread::sleep(Duration::from_millis(delay.min(80)));
        }

        let _ = enigo.key(Key::Control, Direction::Press);
        let _ = enigo.key(Key::Unicode('v'), Direction::Click);
        let _ = enigo.key(Key::Control, Direction::Release);

        thread::sleep(Duration::from_millis(delay.min(80)));

        if let Some(k) = post {
            press_key(&mut enigo, k);
        }
        Ok(())
    })
    .await
    .map_err(|e| e.to_string())?;
    res?;

    if let Some(text) = prev {
        thread::sleep(Duration::from_millis(100));
        let _ = app.clipboard().write_text(text);
    }

    Ok(())
}

#[tauri::command]
fn register_hotkeys(
    app: AppHandle,
    state: State<'_, HotkeyMap>,
    hotkeys: Vec<String>,
) -> Result<(), String> {
    let gs = app.global_shortcut();

    // unregister old
    {
        let mut guard = state.map.lock().unwrap();
        for (_, sc) in guard.drain(..) {
            let _ = gs.unregister(sc);
        }
    }

    let mut new_map: Vec<(String, Shortcut)> = Vec::new();
    for hk in hotkeys {
        let sc = parse_shortcut(&hk)?;
        gs.register(sc).map_err(|e| format!("register {hk} failed: {e}"))?;
        new_map.push((hk, sc));
    }

    *state.map.lock().unwrap() = new_map;
    Ok(())
}

#[tauri::command]
fn unregister_all_hotkeys(
    app: AppHandle,
    state: State<'_, HotkeyMap>,
) -> Result<(), String> {
    let gs = app.global_shortcut();
    let mut guard = state.map.lock().unwrap();
    for (_, sc) in guard.drain(..) {
        let _ = gs.unregister(sc);
    }
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(HotkeyMap::default())
        .manage(SettingsState(RwLock::new(AppSettings::default())))
        .plugin(tauri_plugin_autostart::init(
            tauri_plugin_autostart::MacosLauncher::LaunchAgent,
            None,
        ))
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:ggsay.db", vec![Migration {
                    version: 1,
                    description: "initial schema",
                    sql: r#"
                        CREATE TABLE IF NOT EXISTS games (
                            id TEXT PRIMARY KEY,
                            name TEXT NOT NULL,
                            action_pre TEXT NOT NULL DEFAULT 'Enter',
                            action_post TEXT NOT NULL DEFAULT 'Enter',
                            trigger_mode TEXT NOT NULL DEFAULT 'single',
                            single_hotkey TEXT NOT NULL DEFAULT '',
                            active_group_id TEXT,
                            sort_order REAL NOT NULL DEFAULT 0,
                            updated_at INTEGER NOT NULL,
                            deleted_at INTEGER
                        );
                        CREATE TABLE IF NOT EXISTS groups (
                            id TEXT PRIMARY KEY,
                            game_id TEXT NOT NULL,
                            name TEXT NOT NULL,
                            sort_order REAL NOT NULL DEFAULT 0,
                            updated_at INTEGER NOT NULL,
                            deleted_at INTEGER
                        );
                        CREATE TABLE IF NOT EXISTS messages (
                            id TEXT PRIMARY KEY,
                            group_id TEXT NOT NULL,
                            content TEXT NOT NULL,
                            hotkey TEXT NOT NULL DEFAULT '',
                            sort_order REAL NOT NULL DEFAULT 0,
                            updated_at INTEGER NOT NULL,
                            deleted_at INTEGER
                        );
                        CREATE TABLE IF NOT EXISTS meta (
                            key TEXT PRIMARY KEY,
                            value TEXT NOT NULL
                        );
                        CREATE INDEX IF NOT EXISTS idx_games_updated ON games(updated_at);
                        CREATE INDEX IF NOT EXISTS idx_groups_updated ON groups(updated_at);
                        CREATE INDEX IF NOT EXISTS idx_messages_updated ON messages(updated_at);
                        CREATE INDEX IF NOT EXISTS idx_groups_game ON groups(game_id);
                        CREATE INDEX IF NOT EXISTS idx_messages_group ON messages(group_id);
                    "#,
                    kind: MigrationKind::Up,
                }])
                .build(),
        )
        .plugin(
            tauri_plugin_global_shortcut::Builder::new()
                .with_handler(|app, shortcut, event| {
                    let pressed = matches!(event.state(), ShortcutState::Pressed);
                    if let Some(state) = app.try_state::<HotkeyMap>() {
                        let guard = state.map.lock().unwrap();
                        if let Some((name, _)) =
                            guard.iter().find(|(_, sc)| sc == shortcut)
                        {
                            let _ = app.emit(
                                "hotkey-pressed",
                                HotkeyEvent { hotkey: name.clone(), pressed },
                            );
                        }
                    }
                })
                .build(),
        )
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }

            // System tray icon
            let show_item = MenuItem::with_id(app, "show", "显示 GGSay", true, None::<&str>)?;
            let quit_item = MenuItem::with_id(app, "quit", "退出", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&show_item, &quit_item])?;

            let _tray = TrayIconBuilder::with_id("main")
                .tooltip("GGSay")
                .icon(app.default_window_icon().unwrap().clone())
                .menu(&menu)
                .show_menu_on_left_click(false)
                .on_menu_event(|app, event| match event.id.as_ref() {
                    "show" => show_main_window(app),
                    "quit" => app.exit(0),
                    _ => {}
                })
                .on_tray_icon_event(|tray, event| {
                    if let TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } = event
                    {
                        show_main_window(tray.app_handle());
                    }
                })
                .build(app)?;

            Ok(())
        })
        .on_window_event(|window, event| match event {
            WindowEvent::CloseRequested { api, .. } => {
                let app = window.app_handle();
                let cfg = app.state::<SettingsState>().0.read().map(|s| s.clone()).ok();
                if cfg.map(|c| c.close_to_minimize).unwrap_or(false) {
                    api.prevent_close();
                    let _ = window.hide();
                }
            }
            WindowEvent::Resized(_) => {
                if window.is_minimized().unwrap_or(false) {
                    let app = window.app_handle();
                    let minimize_to_tray = app
                        .state::<SettingsState>()
                        .0
                        .read()
                        .map(|s| s.minimize_to_tray)
                        .unwrap_or(false);
                    if minimize_to_tray {
                        let _ = window.unminimize();
                        let _ = window.hide();
                    }
                }
            }
            _ => {}
        })
        .invoke_handler(tauri::generate_handler![
            send_message,
            register_hotkeys,
            unregister_all_hotkeys,
            update_settings
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn show_main_window(app: &AppHandle) {
    if let Some(w) = app.get_webview_window("main") {
        let _ = w.unminimize();
        let _ = w.show();
        let _ = w.set_focus();
    }
}

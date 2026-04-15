# GGSay

[<img src="https://flagcdn.com/16x12/cn.png" width="16" /> 简体中文](./README.zh-CN.md) · **<img src="https://flagcdn.com/16x12/tw.png" width="16" /> 繁體中文** · [<img src="https://flagcdn.com/16x12/us.png" width="16" /> English](../README.md) · [<img src="https://flagcdn.com/16x12/jp.png" width="16" /> 日本語](./README.ja.md) · [<img src="https://flagcdn.com/16x12/kr.png" width="16" /> 한국어](./README.ko.md) · [<img src="https://flagcdn.com/16x12/es.png" width="16" /> Español](./README.es.md) · [<img src="https://flagcdn.com/16x12/fr.png" width="16" /> Français](./README.fr.md) · [<img src="https://flagcdn.com/16x12/de.png" width="16" /> Deutsch](./README.de.md)

---

遊戲內一鍵發送預設訊息的桌面工具。綁定熱鍵,長按連發,放開即停。

基於 Tauri + Vue 3 建構,安裝包小、啟動快、原生效能。支援 Windows。

## ✨ 功能特性

- **全域熱鍵觸發** — 在任何遊戲內按下熱鍵即可發送,無需切換視窗
- **兩種觸發模式**
  - 單鍵模式:一個熱鍵從訊息組裡隨機抽取一條(洗牌不重複)
  - 多熱鍵模式:每條訊息綁定獨立熱鍵,精準發送指定內容
- **長按連發** — 按住熱鍵持續發送,放開立即停止
- **遊戲 / 分組 / 訊息**三級管理,按場景切換一鍵搞定
- **前置/後置動作** — 可設定發送前後的按鍵(如 Enter 開/關聊天框)
- **自動識別語言** — 首次啟動按系統語言顯示,支援 8 種語言
- **系統匣** — 關閉視窗最小化到系統匣,不打擾遊戲
- **開機自動啟動**(可選)
- **本地資料** — 設定存在本地 SQLite,資料可控

## 📸 螢幕截圖

> _待補充_

## 🚀 安裝

前往 [Releases](https://github.com/rechard-edward/ggsay/releases) 下載最新 **Windows x64** 安裝包:

- `ggsay_x.y.z_x64-setup.exe` —— 單一多語言安裝包。安裝精靈與 App 本身皆支援 8 種語言(簡體中文 / 繁體中文 / English / 日本語 / 한국어 / Español / Français / Deutsch),首次啟動自動辨識系統語言。

## 🎮 使用

1. **新增遊戲**:遊戲頁 → 新增遊戲,填入名稱
2. **設定前置/後置動作**:大多數遊戲用 Enter 開啟聊天框 + Enter 發送
3. **新增分組 + 加入訊息**:按場景把訊息分組(例如「開黑」、「娛樂」)
4. **設定觸發熱鍵**:
   - 單鍵模式:遊戲層級設定一個觸發熱鍵
   - 多熱鍵模式:每條訊息單獨設定
5. **控制台 → 開始監聽**:回到遊戲,按熱鍵即可發送

## 🛠️ 技術堆疊

- **前端**:Vue 3 + TypeScript + Pinia + Vue Router + vue-i18n
- **桌面容器**:Tauri 2(Rust)
- **打包**:Vite
- **本地儲存**:SQLite(透過 `tauri-plugin-sql`)
- **全域熱鍵**:`tauri-plugin-global-shortcut`
- **按鍵模擬**:[enigo](https://github.com/enigo-rs/enigo)

## 🧑‍💻 開發

前置相依:Node.js 20+、pnpm、Rust toolchain、Visual Studio C++ Build Tools(Windows)

```bash
# 安裝相依套件
pnpm install

# 開發模式(帶熱重載)
pnpm tauri dev

# 建構成品 + 安裝包
pnpm tauri build
```

建構完成後:

- 主程式:`src-tauri/target/release/ggsay.exe`
- NSIS 安裝包(多語言):`src-tauri/target/release/bundle/nsis/ggsay_x.y.z_x64-setup.exe`

## 📁 專案結構

```
ggsay-app/
├── src/                   # 前端原始碼
│   ├── views/             # 頁面
│   ├── components/        # 元件
│   ├── stores/            # Pinia store(games / settings)
│   ├── i18n/              # 多國語言
│   └── router/
├── src-tauri/             # Tauri / Rust 端
│   ├── src/lib.rs         # 全域熱鍵、按鍵模擬、系統匣等
│   ├── capabilities/      # 權限設定
│   └── tauri.conf.json    # 應用程式設定
└── docs/                  # 其他語言 README
```

## 🤝 貢獻

歡迎 Issue 和 PR。提交前請先跑一次 `pnpm tauri build` 確保可編譯。

## 📄 授權

MIT License — 詳見 [LICENSE](../LICENSE)

## 🔗 連結

- 官網:[ggsay.com](https://www.ggsay.com)
- Issues:[GitHub Issues](https://github.com/rechard-edward/ggsay/issues)

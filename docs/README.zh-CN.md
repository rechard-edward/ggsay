# GGSay

**🇨🇳 简体中文** · [🇹🇼 繁體中文](./README.zh-TW.md) · [🇺🇸 English](../README.md) · [🇯🇵 日本語](./README.ja.md) · [🇰🇷 한국어](./README.ko.md) · [🇪🇸 Español](./README.es.md) · [🇫🇷 Français](./README.fr.md) · [🇩🇪 Deutsch](./README.de.md)

---

游戏内一键发送预设消息的桌面工具。绑定热键,长按连发,松手即停。

基于 Tauri + Vue 3 构建,安装包小、启动快、原生性能。支持 Windows。

## ✨ 功能特性

- **全局热键触发** — 在任何游戏内按下热键即可发送,无需切换窗口
- **两种触发模式**
  - 单键模式:一个热键从消息组里随机抽取一条(洗牌不重复)
  - 多热键模式:每条消息绑定独立热键,精准发送指定内容
- **长按连发** — 按住热键持续发送,松开立即停止
- **游戏 / 分组 / 消息**三级管理,按场景切换一键搞定
- **前置/后置动作** — 可配置发送前后的按键(如 Enter 开/关聊天框)
- **自动识别语言** — 首次启动按系统语言显示,支持 8 种语言
- **系统托盘** — 关闭窗口最小化到托盘,不打扰游戏
- **开机自启动**(可选)
- **本地数据** — 配置存在本地 SQLite,数据可控

## 📸 截图

> _待补充_

## 🚀 安装

前往 [Releases](https://github.com/rechard-edward/ggsay-app/releases) 下载最新版本:

- **Windows**:`ggsay_x.y.z_x64-setup.exe`(NSIS 安装包,支持中/英/日/韩/西/法/德多语言安装向导)

## 🎮 使用

1. **新建游戏**:游戏页 → 新建游戏,填入名称
2. **设置前置/后置动作**:大多数游戏用 Enter 打开聊天框 + Enter 发送
3. **新建分组 + 添加消息**:按场景把消息分组(比如"开黑"、"娱乐")
4. **设置触发热键**:
   - 单键模式:游戏级设置一个触发热键
   - 多热键模式:每条消息单独设置
5. **控制台 → 开始监听**:回到游戏,按热键即可发送

## 🛠️ 技术栈

- **前端**:Vue 3 + TypeScript + Pinia + Vue Router + vue-i18n
- **桌面容器**:Tauri 2(Rust)
- **打包**:Vite
- **本地存储**:SQLite(通过 `tauri-plugin-sql`)
- **全局热键**:`tauri-plugin-global-shortcut`
- **按键模拟**:[enigo](https://github.com/enigo-rs/enigo)

## 🧑‍💻 开发

前置依赖:Node.js 20+、pnpm、Rust toolchain、Visual Studio C++ Build Tools(Windows)

```bash
# 安装依赖
pnpm install

# 开发模式(带热重载)
pnpm tauri dev

# 构建产物 + 安装包
pnpm tauri build
```

构建完成后:

- 主程序:`src-tauri/target/release/ggsay.exe`
- NSIS 安装包:`src-tauri/target/release/bundle/nsis/ggsay_x.y.z_x64-setup.exe`
- MSI 安装包:`src-tauri/target/release/bundle/msi/ggsay_x.y.z_x64_en-US.msi`

只想构建特定格式:

```bash
pnpm tauri build --bundles nsis   # 仅 NSIS
pnpm tauri build --bundles msi    # 仅 MSI
pnpm tauri build --bundles app    # 仅主程序,不打包
```

## 📁 项目结构

```
ggsay-app/
├── src/                   # 前端源码
│   ├── views/             # 页面
│   ├── components/        # 组件
│   ├── stores/            # Pinia store(games / settings)
│   ├── i18n/              # 多语言
│   └── router/
├── src-tauri/             # Tauri / Rust 端
│   ├── src/lib.rs         # 全局热键、按键模拟、系统托盘等
│   ├── capabilities/      # 权限配置
│   └── tauri.conf.json    # 应用配置
└── docs/                  # 其他语言 README
```

## 🤝 贡献

欢迎 Issue 和 PR。提交前请先跑一遍 `pnpm tauri build` 确保可编译。

## 📄 许可

MIT License — 详见 [LICENSE](../LICENSE)

## 🔗 链接

- 官网:[ggsay.com](https://www.ggsay.com)
- Issues:[GitHub Issues](https://github.com/rechard-edward/ggsay-app/issues)

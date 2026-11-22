# WPS Word AI Pilot

> 给 WPS 文字装一个 AI 助手：右边栏聊两句，结果一键插进正文。

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Release](https://img.shields.io/github/v/release/ttbr5145/wps-word-ai-pilot?display_name=tag&sort=semver)](https://github.com/ttbr5145/wps-word-ai-pilot/releases)
[![Platform](https://img.shields.io/badge/Platform-WPS%20Office%20%7C%20Windows-lightgrey.svg)]()
[![Stack](https://img.shields.io/badge/Stack-JavaScript%20%2B%20Vite-yellow.svg)]()
[![Status](https://img.shields.io/badge/Status-MVP-orange.svg)](CHANGELOG.md)

WPS Word AI Pilot 是一个运行在 **WPS 文字** 里的 JS 加载项（TaskPane 类型）。它在功能区多出一个 `AI Pilot` 选项卡，点开就是两个侧边栏：一个用来和 AI 对话，一个用来攒写作素材，两条链路都能把文字直接写进当前文档，不用来回复制粘贴。

> 仓库原名 `AI_Pilot_for_WPS_Word`，已更名为 `wps-word-ai-pilot`，旧链接会自动跳转。

## 功能

**AI 对话助手**

- 接入 ChatAnywhere 的 OpenAI 兼容接口，一把 API Key 就能用。
- 9 个可选模型：GPT-5 Nano / GPT-5 Mini / GPT-5.1 / DeepSeek R1 / Claude Opus 4.5 / Gemini 2.5 Pro / Grok 4 / Qwen3 Max / Kimi K2.5。
- 5 套内置系统提示词：默认助手、写作、编辑、翻译、摘要，另可自定义。
- 回复下方两个按钮：`保存到素材库`、`插入文档`（写入当前选区，无选区则写入文首）。
- 多轮上下文保留在本会话内，可一键清空。

**素材库**

- 素材的新增、编辑、删除、复制、插入文档，全部操作即点即生效，不弹确认框。
- 数据同时落 `localStorage` 和 WPS `PluginStorage`，换机器/重开 WPS 都能读回。
- AI 回复可以一键沉淀成素材，写作时反复取用。

## 安装

**方式一：安装包（推荐给普通用户）**

1. 从 [Releases](https://github.com/ttbr5145/wps-word-ai-pilot/releases) 下载 `wps-gift-installer.exe`。
2. 双击运行，默认装到 `%LOCALAPPDATA%\WPSAddins\AI_Pilot_for_WPS_Word`。
3. 打开 WPS 文字 → 工具 → 加载项 → XML 扩展包，选择安装目录下的 `manifest.xml` 加载。

**方式二：脚本安装**

```powershell
# 解压 wps-gift.zip 后，在解压目录执行
PowerShell -ExecutionPolicy Bypass -File .\install.ps1
```

脚本会复制文件、生成自签名证书并导入当前用户的「受信任根证书」，然后自动打开 `manifest.xml` 所在目录。卸载用 `uninstall.ps1`。

> 自签名证书仅适合开发与内部分发；对外发布请购买代码签名证书重新签名 `manifest.xml`。

## 配置 API Key

1. 到 [chatanywhere.tech](https://chatanywhere.tech) 申请 Key。
2. WPS 里点功能区 `AI Pilot` → `AI 助理` 打开侧边栏，点右上角 ⚙。
3. 填入 API Key，选模型、选提示词，保存。

默认接口地址 `https://api.chatanywhere.tech/v1`，也可在 `js/ai-config.js` 里改成任何 OpenAI 兼容服务（DeepSeek、自建网关等）。

## 本地开发

```powershell
git clone https://github.com/ttbr5145/wps-word-ai-pilot.git
cd wps-word-ai-pilot
npm install      # node_modules 已不入库，必须本地装
npm run dev      # Vite 起在 http://localhost:3889
npm run build    # 产物进 dist/
```

调试时把 `manifest.xml` 的 `SourceLocation` 指向本地服务地址即可，仓库内的清单已默认写成 `http://localhost:3889/index.html`。

## 项目结构

```
├─ index.html              # 加载项入口，WPS 启动时加载
├─ main.js                 # 启动脚本
├─ manifest.xml            # 加载项清单（名称、入口、权限）
├─ ribbon.xml              # 功能区定义：AI 助理 / 素材库 两个按钮
├─ js/
│  ├─ ai-config.js         # 接口地址、模型列表、系统提示词
│  ├─ aipane.js            # AI 对话面板：发消息、调接口、插入文档
│  ├─ materialpane.js      # 素材库面板：增删改查、复制、插入
│  ├─ ribbon.js            # 功能区按钮事件、侧边栏显示隐藏
│  └─ dialog.js / taskpane.js / util.js / systemdemo.js
├─ ui/
│  ├─ aipane.html          # AI 对话界面
│  ├─ materialpane.html    # 素材库界面
│  └─ dialog.html / taskpane.html
├─ images/                 # 功能区 SVG 图标
├─ dist/                   # 构建与安装产物（含 install/uninstall 脚本、签名后的清单）
├─ vite.config.js          # 构建时把 manifest/js/ui/images 复制到 dist
├─ sign-manifest.ps1       # 用 PFX 为 manifest.xml 加 XML 签名
├─ wps-gift-installer.nsi  # NSIS 安装包脚本
└─ build_and_sign_temp.ps1 # 一键：签清单 → 导出证书 → 打包 exe（证书密码运行时输入，不入库）
```

## 常见问题

**侧边栏打开是空白？**
多半是 `manifest.xml` 里的 `SourceLocation` 打不开。开发态确认 Vite 已启动且端口一致（默认 3889）；分发给别人时改成可访问的部署地址。

**API 调用报错？**
依次查：Key 是否填对、账户额度是否还有、网络能否直连 `api.chatanywhere.tech`。错误信息会直接显示在对话气泡里。

**数据存在哪？**
素材在 `localStorage` 与 `PluginStorage` 的 `materials` 键；配置在 `ai_config`、`ai_provider` 键。两者都只在本机，不上传。

**为什么素材操作没有任何提示？**
刻意设计——素材是高频轻操作，弹窗提示会打断写作节奏。

## 安全提示

- 本仓库 **不内置任何可用的 API Key**。请在设置里填自己的 Key，不要把 Key 提交回仓库。
- 仓库历史上出现过示例 Key 与自签名证书私钥（`temp.pfx`）。二者均已从当前版本移除并加入 `.gitignore`，但它们仍存在于 Git 历史中，请自行作废/轮换。
- 加载项申请的是 `ReadWriteDocument` 权限，即可以读写当前文档内容，请只在信任来源安装。

## 许可证

[MIT](LICENSE) © 2026 吴桐 (ttbr5145)

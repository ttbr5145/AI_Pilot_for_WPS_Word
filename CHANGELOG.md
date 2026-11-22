# 更新日志

本项目遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## v1.0.1 — 2026-11-22

重新构建的干净发布版，功能与 v1.0.0 一致，仅修构建产物与仓库卫生。

### 修复
- 重新打包所有发布附件：安装包内的 `js/ai-config.js` 不再携带早期示例 API Key。
- 安装包内 `manifest.xml` 的 `SourceLocation` 由 3890 改为 3889，与 `npm run dev` 一致；并修复其被二次编码的中文描述。
- `dist/README_INSTALL.md` 重写为可读中文，补充“填入自己的 API Key”步骤。
- `build_and_sign_temp.ps1` 不再硬编码证书密码，改为运行时输入。

### 变更
- 版本号升至 1.0.1；`node_modules/` 与 `temp.pfx` 不再入库（见 v1.0.0 条目）。

## v1.0.0 — 2026-02-10

首个可用版本（MVP）。

### 新增
- AI 对话侧边栏：接入 ChatAnywhere（OpenAI 兼容）接口，支持模型切换与温度、最大 token 配置。
- 五套内置系统提示词（默认 / 写作 / 编辑 / 翻译 / 摘要）+ 自定义提示词。
- AI 回复支持「保存到素材库」「插入文档」两个动作。
- 素材库侧边栏：新增、编辑、删除、复制、插入文档，数据持久化到 `localStorage` 与 `PluginStorage`。
- 功能区（Ribbon）两个入口按钮：AI 助理、素材库，支持侧边栏显示/隐藏切换。
- 安装方案：`install.ps1` / `uninstall.ps1` 脚本，配套 NSIS 安装包 `wps-gift-installer.exe`。
- 清单签名脚本 `sign-manifest.ps1`，避免 WPS 加载时的安全提示。

### 变更
- 移除 `js/ai-config.js` 中硬编码的示例 API Key，改为留空并在侧边栏设置中填写。
- 移除自签名证书私钥 `temp.pfx`，构建脚本改为运行时输入密码。
- `node_modules/` 退出版本控制（保留 `package-lock.json`），仓库体积从 ~21 MB 降至源码级。
- 修正 `manifest.xml` / `dist/manifest.xml` 的 `SourceLocation` 端口（3890 → 3889）。
- 新增 `LICENSE`（MIT）、`.gitignore`、本文件，重写 README。

### 已知问题
- 仓库历史中仍存在已作废的示例 Key 与证书私钥，不再随当前版本分发；如需彻底清除需重写 Git 历史。

# AI Pilot for WPS Word

一个集成AI功能的WPS Word加载项，提供AI对话助手和素材库功能。

## 功能特性

### 🤖 AI对话助手
- 集成ChatAnywhere API (OpenAI兼容格式)
- 实时对话交互
- 多种预设提示词（写作助手、编辑助手、翻译助手、摘要助手）
- 自定义系统提示词
- 一键保存AI回复到素材库
- 一键插入内容到WPS文档
- 对话历史管理

### 📚 素材库
- 快速添加、编辑、删除素材
- 一键插入素材到WPS文档
- 复制素材到剪贴板
- 数据持久化存储（localStorage + PluginStorage）
- 无弹窗操作，简洁高效

## 安装使用

### 1. 安装依赖
```bash
npm install
```

### 2. 配置AI API
1. 启动WPS并打开加载项
2. 点击"AI对话"按钮打开侧边栏
3. 点击右上角设置图标⚙
4. 输入DeepSeek API Key
5. 选择或自定义系统提示词

### 3. 运行开发环境
```bash
npm run dev
```
访问 http://localhost:3889

### 4. 获取ChatAnywhere API Key
访问 https://chatanywhere.tech 获取API Key

### 5. 构建生产版本
```bash
npm run build
```

## ChatAnywhere API配置

获取API Key：https://chatanywhere.tech/

```
API Key: sk-xxxxxxxxxxxxx
BaseURL: https://api.chatanywhere.tech/v1
模型: gpt-5.1-2025-11-13 (默认，可切换)
```

### 可用模型

支持以下模型切换：
- GPT-5.1 (2025-11-13) - 最新GPT模型
- DeepSeek R1 (250528) - DeepSeek最新模型
- Claude Opus 4.5 - Anthropic最强模型
- Gemini 2.5 Pro - Google最新模型
- Grok 4 - xAI模型
- Qwen3 Max (2026-01-23) - 通义千问最新
- Kimi K2.5 - 月之暗面最新模型

## 快捷键

### AI对话面板
- `Enter`: 发送消息
- `Shift + Enter`: 换行
- `ESC`: 关闭设置对话框

### 素材库面板
无快捷键，使用按钮操作

## 项目结构

```
├── js/
│   ├── aipane.js          # AI对话面板逻辑
│   ├── ai-config.js       # DeepSeek AI配置管理
│   ├── materialpane.js    # 素材库面板逻辑
│   ├── ribbon.js          # 功能区按钮事件处理
│   ├── util.js            # 工具函数
│   └── ...
├── ui/
│   ├── aipane.html        # AI对话界面
│   ├── materialpane.html  # 素材库界面
│   └── ...
├── manifest.xml           # 加载项清单
├── ribbon.xml             # 功能区UI定义
└── ...
```

## 常见问题

### Q: API调用失败怎么办？
A: 请检查：
1. API Key是否正确
2. API额度是否充足
3. 网络连接是否正常

### Q: 数据存储在哪里？
A: 在WPS环境中使用PluginStorage，开发环境使用localStorage。

### Q: 素材库操作没有提示吗？
A: 是的，为保持简洁高效，素材库的所有操作（添加、删除、插入、复制）均无弹窗提示。

## 开发说明

### 主要文件说明

- `js/ai-config.js`: DeepSeek AI API配置管理
- `js/aipane.js`: AI对话核心逻辑，处理消息收发、API调用
- `js/materialpane.js`: 素材库核心逻辑，处理素材的增删改查
- `js/ribbon.js`: 功能区按钮事件，控制侧边栏显示/隐藏
- `ui/aipane.html`: AI对话界面UI（简洁WPS风格）
- `ui/materialpane.html`: 素材库界面UI（简洁WPS风格）

## 许可证

MIT License

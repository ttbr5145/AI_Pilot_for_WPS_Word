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
- 默认使用GPT 5-nano模型（200次/日高频率限额）

### 📚 素材库
- 快速添加、编辑、删除素材
- 一键插入素材到WPS文档
- 复制素材到剪贴板
- 数据持久化存储（localStorage + PluginStorage）
- 无弹窗操作，简洁高效
- 完整的增删改查功能

## 安装使用

### 1. 安装依赖
```bash
npm install
```

### 2. 配置AI API
1. 启动WPS并打开加载项
2. 点击"AI对话"按钮打开侧边栏
3. 点击右上角设置图标⚙
4. 输入ChatAnywhere API Key
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

## 打包发布

### 📦 构建生产版本
```bash
npm run build
```
构建完成后，所有文件将输出到 `dist/` 目录。

### 🎯 发布准备清单

#### 必需文件
构建后的 `dist/` 目录应包含以下文件：
```
dist/
├── manifest.xml           # 加载项清单文件
├── ribbon.xml            # 功能区UI定义
├── main.js               # 主入口文件
├── js/                   # JavaScript逻辑文件
│   ├── aipane.js
│   ├── ai-config.js
│   ├── materialpane.js
│   ├── ribbon.js
│   └── util.js
├── ui/                   # 界面HTML文件
│   ├── aipane.html
│   └── materialpane.html
├── images/               # 图标资源文件
│   ├── 1.svg
│   ├── 2.svg
│   ├── 3.svg
│   ├── chat_v2.svg
│   └── idea.svg
└── index.html            # 入口HTML文件
```

#### 发布方式选择

##### 方式一：本地目录加载（开发测试）
1. 在WPS中启用开发者模式
2. 选择"开发加载项" → "从目录加载"
3. 选择 `dist/` 目录路径
4. 重启WPS即可使用

##### 方式二：打包为ZIP文件
```bash
# 在dist目录下创建zip包
cd dist
zip -r ../ai-pilot-wps-addon.zip .
```

##### 方式三：企业部署
1. 将 `dist/` 目录内容部署到企业内网服务器
2. 在WPS中配置网络加载项地址
3. 用户可通过网络直接加载使用

### 🚀 发布验证清单

发布前请验证以下功能：

- [ ] AI对话功能正常（测试API连接）
- [ ] 素材库增删改查功能完整
- [ ] 图标显示正常
- [ ] 快捷键功能有效（F2配置，F3刷新）
- [ ] 数据持久化正常（localStorage/PluginStorage）
- [ ] 文档插入功能正常
- [ ] 系统提示词切换正常

### 📝 版本管理建议

建议采用语义化版本号：
- 主版本号：重大功能更新或架构变更
- 次版本号：新增功能或重要改进
- 修订号：bug修复或小幅度优化

示例版本更新：
```
v1.0.0 → v1.1.0 （新增功能）
v1.1.0 → v1.1.1 （bug修复）
v1.1.1 → v2.0.0 （重大重构）
```

## ChatAnywhere API配置

获取API Key：https://chatanywhere.tech/

```
API Key: sk-xxxxxxxxxxxxx
BaseURL: https://api.chatanywhere.tech/v1
默认模型: gpt-5-nano (200次/日)
```

### 可用模型

支持以下模型切换：
- **GPT-5 Nano** (默认) - 200次/日，轻量快速
- **GPT-5 Mini** - 200次/日，平衡性能
- **GPT-5.1** (2025-11-13) - 5次/日，高性能
- **DeepSeek R1** (250528) - 30次/日，中文优化
- Claude Opus 4.5 - 0次/日
- Gemini 2.5 Pro - 0次/日
- Grok 4 - 0次/日
- Qwen3 Max (2026-01-23) - 0次/日
- Kimi K2.5 - 0次/日

## 快捷键

- `Enter`: 发送消息
- `Shift + Enter`: 换行
- `ESC`: 关闭设置对话框


## 项目结构

```
├── js/
│   ├── aipane.js          # AI对话面板逻辑
│   ├── ai-config.js       # AI配置管理
│   ├── materialpane.js    # 素材库面板逻辑
│   ├── ribbon.js          # 功能区按钮事件处理
│   ├── util.js            # 工具函数
│   └── ...
├── ui/
│   ├── aipane.html        # AI对话界面
│   ├── materialpane.html  # 素材库界面
│   └── ...
├── images/                # 图标资源
│   ├── 1.svg              # AI助手图标
│   ├── 2.svg              # 写作模式图标
│   ├── 3.svg              # 素材库图标
│   ├── chat_v2.svg        # 聊天图标
│   └── idea.svg           # 创意图标
├── manifest.xml           # 加载项清单
├── ribbon.xml             # 功能区UI定义
├── vite.config.js         # 构建配置
├── package.json           # 项目配置
└── README.md              # 说明文档
```

## 常见问题

### Q: API调用失败怎么办？
A: 请检查：
1. API Key是否正确
2. API额度是否充足
3. 网络连接是否正常
4. 防火墙是否阻止访问

### Q: 数据存储在哪里？
A: 在WPS环境中使用PluginStorage，开发环境使用localStorage。

### Q: 素材库操作没有提示吗？
A: 是的，为保持简洁高效，素材库的所有操作（添加、删除、插入、复制）均无弹窗提示。

### Q: 如何更新已发布的加载项？
A: 
1. 重新构建新版本
2. 替换原有文件
3. 在WPS中重新加载加载项
4. 建议备份用户数据

## 开发说明

### 主要文件说明

- `js/ai-config.js`: AI API配置管理，默认模型为GPT 5-nano
- `js/aipane.js`: AI对话核心逻辑，处理消息收发、API调用
- `js/materialpane.js`: 素材库核心逻辑，处理素材的增删改查
- `js/ribbon.js`: 功能区按钮事件，控制侧边栏显示/隐藏
- `ui/aipane.html`: AI对话界面UI（简洁WPS风格）
- `ui/materialpane.html`: 素材库界面UI（简洁WPS风格）

### 构建工具
- **Vite**: 现代化构建工具，支持热更新
- **wpsjs**: WPS JS API支持插件
- **ESLint**: 代码质量检查
- **Prettier**: 代码格式化

## 许可证

MIT License
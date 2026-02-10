# WPS加载项发布指南

## 📦 打包发布流程

### 1. 准备发布版本

#### 1.1 代码审查清单
- [ ] 确认所有功能测试通过
- [ ] 检查API密钥等敏感信息已移除
- [ ] 验证配置文件正确性
- [ ] 确认版本号已更新

#### 1.2 构建生产版本
```bash
# 清理旧构建
rm -rf dist/

# 构建新版本
npm run build
```

### 2. 文件验证

#### 2.1 必需文件检查
构建完成后，验证 `dist/` 目录包含以下文件：

```bash
ls -la dist/
# 应该包含：
# manifest.xml     # 加载项清单
# ribbon.xml       # 功能区定义
# main.js          # 主入口文件
# index.html       # HTML入口
# js/              # JavaScript文件夹
# ui/              # 界面文件夹
# images/          # 图标资源
```

#### 2.2 文件完整性验证
```bash
# 检查关键文件大小
ls -lh dist/*.xml dist/*.js dist/*.html
# 确保文件不为空（大于1KB）

# 验证JavaScript文件
ls -lh dist/js/*.js
# 确保所有JS文件都存在且不为空
```

### 3. 打包方式

#### 方式一：ZIP压缩包（推荐）
```bash
cd dist/
zip -r ../ai-pilot-wps-addon-v1.0.0.zip .
cd ..
```

#### 方式二：直接目录部署
```bash
# 复制整个dist目录到目标位置
cp -r dist/ /path/to/deployment/location/
```

### 4. 版本管理

#### 4.1 版本号更新
在 `package.json` 中更新版本号：
```json
{
  "name": "AI_Pilot_for_WPS_Word",
  "version": "1.0.0",  // 更新此处
  "description": "WPS AI助手加载项"
}
```

#### 4.2 发布版本命名规范
```
格式：ai-pilot-wps-addon-v{主版本}.{次版本}.{修订版本}.zip
示例：ai-pilot-wps-addon-v1.0.0.zip
      ai-pilot-wps-addon-v1.1.0.zip
      ai-pilot-wps-addon-v2.0.0.zip
```

### 5. 发布渠道

#### 5.1 企业内部部署
1. 将构建文件部署到内网服务器
2. 配置WPS网络加载项地址
3. 向员工提供加载项URL

#### 5.2 开发者测试
1. 使用ZIP包进行本地测试
2. 在WPS开发者模式下加载
3. 验证所有功能正常

#### 5.3 商业发布准备
1. 准备用户手册和FAQ
2. 创建安装说明文档
3. 准备技术支持联系方式

## 🔧 部署配置

### WPS加载项配置

#### manifest.xml 配置要点
```xml
<?xml version="1.0" encoding="UTF-8"?>
<JsPlugin>
  <ApiVersion>1.0.0</ApiVersion>
  <Name>AI Pilot for WPS Word</Name>
  <Description>AI助手插件，提供AI对话和素材库管理功能</Description>
</JsPlugin>
```

#### 功能区配置 (ribbon.xml)
确保按钮ID与JavaScript代码中的处理函数匹配：
```xml
<button id="btnShowAIPane" label="AI助手" onAction="OnAction" />
<button id="btnShowMaterialPane" label="写作模式" onAction="OnAction" />
```

### 环境要求

#### 客户端要求
- WPS Office 最新版本
- 支持JavaScript加载项功能
- 网络连接（用于AI API调用）

#### 服务器要求（如需要）
- HTTPS支持（API调用安全）
- 稳定的网络连接
- 适当的带宽支持

## 🧪 测试验证

### 发布前测试清单

#### 功能测试
- [ ] AI对话功能（发送消息、接收回复）
- [ ] 素材库功能（添加、编辑、删除、插入）
- [ ] 图标显示正常
- [ ] 快捷键功能（F2配置，F3刷新）
- [ ] 数据持久化（重启后数据不丢失）
- [ ] 错误处理（网络断开、API错误等）

#### 兼容性测试
- [ ] 不同WPS版本兼容性
- [ ] Windows/macOS跨平台测试
- [ ] 网络环境适应性测试

#### 性能测试
- [ ] 启动速度测试
- [ ] 内存占用监控
- [ ] 响应时间测量

### 自动化测试脚本
```bash
# 运行构建验证
npm run build && echo "构建成功"

# 运行代码检查
npm run lint

# 运行格式化检查
npm run format
```

## 📋 发布文档

### 用户安装指南
创建 `INSTALLATION.md` 文件：
```markdown
# AI Pilot 加载项安装指南

## 系统要求
- WPS Office 2019或更高版本
- Windows 7/8/10/11 或 macOS 10.14+

## 安装步骤
1. 下载加载项ZIP文件
2. 解压到本地目录
3. 在WPS中启用开发者模式
4. 选择"开发加载项" → "从目录加载"
5. 选择解压后的目录
6. 重启WPS

## 首次使用
1. 点击"AI助手"按钮
2. 在设置中配置API Key
3. 开始使用AI功能
```

### 更新日志模板
创建 `CHANGELOG.md` 文件：
```markdown
# 更新日志

## [1.0.0] - 2024-01-01
### 新增功能
- AI对话助手功能
- 素材库管理功能
- 系统提示词预设
- 快捷键支持

### 改进
- 优化界面交互体验
- 提升数据存储稳定性
- 改善错误处理机制

### 修复
- 修复了素材保存无响应问题
- 解决了网络超时处理
```

## ⚠️ 注意事项

### 安全考虑
1. **API密钥保护**：不要在代码中硬编码API密钥
2. **数据传输安全**：确保API调用使用HTTPS
3. **用户隐私**：明确告知用户数据使用方式

### 性能优化
1. **资源压缩**：确保图片和JS文件经过压缩
2. **懒加载**：非必要资源延迟加载
3. **缓存策略**：合理使用浏览器缓存

### 维护建议
1. **定期更新**：跟进WPS API变化
2. **用户反馈**：建立反馈收集机制
3. **版本回滚**：准备紧急回滚方案

## 🆘 技术支持

### 常见问题解决
提供详细的FAQ文档和技术支持联系方式。

### 社区支持
建立用户交流群组或论坛。

---
*本文档最后更新：2024年*
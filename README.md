# Vue to React MCP

一个用于自动化 Vue 到 React 迁移的 MCP (Model Context Protocol) 服务器。

## 功能特性

- 🚀 自动分析 Vue 组件并生成 React 迁移计划
- 📚 智能学习迁移模式，持续优化迁移指南
- 🔄 支持路由配置自动转换
- 📝 自动维护 MIGRATION_GUIDE.md 知识库
- 🎯 通用化设计，适用于任何 Vue 到 React 项目

## 安装

```bash
npm install -g @chenlujiang/vue-to-react-mcp
```

## 配置

在您的 Claude Desktop 配置文件中添加：

```json
{
  "mcpServers": {
    "vue-to-react": {
      "command": "npx",
      "args": [
        "@chenlujiang/vue-to-react-mcp",
        "--vue-project", "/path/to/vue/project",
        "--react-project", "/path/to/react/project"
      ]
    }
  }
}
```

## 使用方法

### 1. MIGRATE_PAGE - 迁移页面

通过自然语言告诉 AI 您想迁移的页面：

- "帮我迁移请假列表页面"
- "迁移 in-class-student 页面"
- "将 Vue 的用户管理页面迁移到 React"

AI 将会：
1. 分析 Vue 组件结构
2. 提议路由配置修改
3. 生成详细的迁移计划
4. 在您批准后执行迁移

### 2. LEARN_FROM_CHANGES - 学习优化

当您完成代码优化后，告诉 AI 学习您的改动：

- "我改好了，你学习一下吧"
- "学习一下 src/pages/leave-list 目录的改动"

AI 将会：
1. 分析您的代码改动
2. 提炼通用的最佳实践
3. 更新 MIGRATION_GUIDE.md

## 工作原理

1. **智能识别**: AI 通过自然语言理解您的迁移意图
2. **深度分析**: 全面分析 Vue 组件的 UI、逻辑和 API
3. **知识积累**: 通过 MIGRATION_GUIDE.md 持续积累迁移经验
4. **持续优化**: 从每次迁移中学习，不断改进迁移质量

## 许可证

MIT

## 贡献

欢迎提交 Issue 和 Pull Request！ 
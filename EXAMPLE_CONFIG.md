# Vue to React MCP 配置示例

## Claude Desktop 配置

在 Claude Desktop 的配置文件中添加以下内容：

### macOS/Linux
配置文件位置：`~/.claude/claude_desktop_config.json`

### Windows
配置文件位置：`%APPDATA%\Claude\claude_desktop_config.json`

### 配置内容

```json
{
  "mcpServers": {
    "vue-to-react": {
      "command": "npx",
      "args": [
        "@chenlujiang/vue-to-react-mcp",
        "--vue-project", "/path/to/your/vue/project",
        "--react-project", "/path/to/your/react/project"
      ]
    }
  }
}
```

## 参数说明

- `--vue-project`: Vue 项目的绝对路径（源项目）
- `--react-project`: React 项目的绝对路径（目标项目）

## 使用示例

假设您有以下项目结构：
```
/Users/yourname/projects/
├── old-vue-app/        # Vue 项目
└── new-react-app/      # React 项目
```

配置应该是：
```json
{
  "mcpServers": {
    "vue-to-react": {
      "command": "npx",
      "args": [
        "@chenlujiang/vue-to-react-mcp",
        "--vue-project", "/Users/yourname/projects/old-vue-app",
        "--react-project", "/Users/yourname/projects/new-react-app"
      ]
    }
  }
}
```

## 验证配置

1. 保存配置文件
2. 重启 Claude Desktop
3. 在对话中输入："帮我迁移用户列表页面"
4. AI 应该能够识别并开始迁移流程

## 故障排除

如果 MCP 无法正常工作，请检查：

1. 路径是否正确（必须是绝对路径）
2. 项目目录是否存在
3. 是否已安装 `@chenlujiang/vue-to-react-mcp`
4. Claude Desktop 是否已重启 
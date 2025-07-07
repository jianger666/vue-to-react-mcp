#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { 
  ListToolsRequestSchema, 
  CallToolRequestSchema,
  ErrorCode,
  McpError
} from '@modelcontextprotocol/sdk/types.js';
import { migratePage } from './tools/migratePage.js';
import { learnFromChanges } from './tools/learnFromChanges.js';
import { ensureMigrationGuide } from './utils/fileOperations.js';
import { findFiles } from './utils/fileOperations.js';
import { logger } from './utils/logger.js';
import path from 'path';

// 解析命令行参数
const args = process.argv.slice(2);
let vueProjectPath = '';
let reactProjectPath = '';

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--vue-project' && i + 1 < args.length) {
    vueProjectPath = args[i + 1];
  } else if (args[i] === '--react-project' && i + 1 < args.length) {
    reactProjectPath = args[i + 1];
  }
}

if (!vueProjectPath || !reactProjectPath) {
  console.error('Error: Both --vue-project and --react-project arguments are required');
  process.exit(1);
}

// 创建服务器
const server = new Server({
  name: 'vue-to-react-mcp',
  version: '1.0.0',
}, {
  capabilities: {
    tools: {},
  },
});

// 注册工具列表处理器
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'migrate_page',
        description: '将 Vue 页面迁移到 React。使用自然语言描述要迁移的页面，例如："迁移用户列表页面"',
        inputSchema: {
          type: 'object',
          properties: {
            pageName: {
              type: 'string',
              description: '要迁移的页面名称或路径'
            },
            vueFilePath: {
              type: 'string',
              description: 'Vue 文件的相对路径（可选，如果未提供将自动搜索）'
            }
          },
          required: ['pageName']
        }
      },
      {
        name: 'learn_from_changes',
        description: '从用户的代码修改中学习，更新迁移指南。使用自然语言描述，例如："学习一下 src/pages/user-list 的改动"',
        inputSchema: {
          type: 'object',
          properties: {
            targetDirectory: {
              type: 'string',
              description: '要学习的 React 页面目录'
            },
            lastGeneratedCode: {
              type: 'string',
              description: 'AI 最后生成的代码内容'
            }
          },
          required: ['targetDirectory']
        }
      },
      {
        name: 'list_vue_files',
        description: '列出 Vue 项目中的所有 Vue 文件，用于调试和查看可用的文件',
        inputSchema: {
          type: 'object',
          properties: {},
          required: []
        }
      }
    ]
  };
});

// 注册工具调用处理器
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    // 确保 MIGRATION_GUIDE.md 存在
    await ensureMigrationGuide(reactProjectPath);

    switch (name) {
      case 'migrate_page':
        const migrateResult = await migratePage({
          pageName: args?.pageName as string,
          vueFilePath: args?.vueFilePath as string | undefined,
          vueProjectPath,
          reactProjectPath
        });
        return migrateResult;

      case 'learn_from_changes':
        const learnResult = await learnFromChanges({
          targetDirectory: args?.targetDirectory as string,
          lastGeneratedCode: args?.lastGeneratedCode as string | undefined,
          reactProjectPath
        });
        return learnResult;

      case 'list_vue_files':
        const vueFiles = await findFiles(vueProjectPath, /\.vue$/);
        const relativeFiles = vueFiles.map(f => path.relative(vueProjectPath, f));
        
        const listResult = {
          content: [
            {
              type: 'text',
              text: `## Vue 项目文件列表

**Vue 项目路径**: \`${vueProjectPath}\`

**找到的 Vue 文件 (${vueFiles.length} 个)**:
${relativeFiles.map(f => `- \`${f}\``).join('\n')}

您可以使用这些文件路径调用 \`migrate_page\` 工具，例如：
\`\`\`json
{
  "pageName": "发单页面",
  "vueFilePath": "src/views/order/CreateOrder.vue"
}
\`\`\``
            }
          ]
        };
        return listResult;

      default:
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${name}`
        );
    }
  } catch (error) {
    logger.error('Tool execution error:', error);
    
    if (error instanceof McpError) {
      throw error;
    }
    
    throw new McpError(
      ErrorCode.InternalError,
      `工具执行失败: ${error instanceof Error ? error.message : String(error)}`
    );
  }
});

// 启动服务器
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  logger.info('Vue to React MCP server started', {
    vueProjectPath,
    reactProjectPath
  });
}

main().catch((error) => {
  logger.error('Server error:', error);
  process.exit(1);
}); 
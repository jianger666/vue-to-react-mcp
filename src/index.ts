#!/usr/bin/env node

/**
 * Vue to React MCP 服务器
 * 
 * 工具调用流程：
 * 1. get_from_application - 获取项目信息，检查任务文件
 * 2. migrate_page 或 continue_migrate_page - 根据任务文件存在与否选择
 * 3. save_ai_baseline - 每个任务完成后保存基准版本
 * 4. learn_from_changes - 用户要求学习时对比修改
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  ListToolsRequestSchema,
  CallToolRequestSchema
} from '@modelcontextprotocol/sdk/types.js';
import { migratePage } from './tools/migratePage';
import { learnFromChanges } from './tools/learnFromChanges';
import { getFromApplication } from './tools/getFromApplication';
import { saveAIBaseline } from './tools/saveAIBaseline';
import { continueMigratePage } from './tools/continueMigratePage';

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
        name: 'get_from_application',
        description: '获取Vue和React项目路径，读取迁移指南，检查任务文件。用户提出迁移需求时首先调用此工具，获取项目信息后判断是新迁移还是继续迁移。',
        inputSchema: {
          type: 'object',
          properties: {},
          required: []
        }
      },
      {
        name: 'migrate_page',
        description: '创建新的页面迁移任务。当get_from_application检查发现没有migrate_task.md文件时调用，用于拆解任务并创建任务文件。',
        inputSchema: {
          type: 'object',
          properties: {},
          required: []
        }
      },
      {
        name: 'continue_migrate_page',
        description: '继续执行未完成的迁移任务。当get_from_application检查发现存在migrate_task.md文件时调用，读取并执行下一个未完成的任务。',
        inputSchema: {
          type: 'object',
          properties: {},
          required: []
        }
      },
      {
        name: 'save_ai_baseline',
        description: '保存AI生成的代码基准版本。每完成一个任务后必须调用此工具，保存的基准版本用于后续学习比对。文件保存在.ai-baseline目录，自动清理3天前的旧文件。',
        inputSchema: {
          type: 'object',
          properties: {
            files: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  filePath: {
                    type: 'string',
                    description: '文件路径（相对于 React 项目根目录）'
                  },
                  content: {
                    type: 'string',
                    description: 'AI 生成的文件内容'
                  }
                },
                required: ['filePath', 'content']
              },
              description: '要保存的文件数组，每个文件包含路径和内容'
            }
          },
          required: ['files']
        }
      },
      {
        name: 'learn_from_changes',
        description: '对比AI基准版本和用户修改版本，学习用户的代码偏好并更新迁移指南。用户修改代码后主动要求学习时调用。注意：更新指南时要平衡增删，避免指南过于冗长。',
        inputSchema: {
          type: 'object',
          properties: {
            targetFiles: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: '要学习的 React 文件路径数组（相对于 React 项目根目录），如 ["src/components/UserList.tsx", "src/styles/user.css"]'
            }
          },
          required: ['targetFiles']
        }
      }
    ]
  };
});

// 注册工具调用处理器
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;


  switch (name) {
    case 'get_from_application':
      return await getFromApplication({
        vueProjectPath,
        reactProjectPath
      });

    case 'migrate_page':
      return await migratePage();

    case 'continue_migrate_page':
      return await continueMigratePage();


    case 'save_ai_baseline':
      return await saveAIBaseline({
        files: args?.files as Array<{ filePath: string; content: string }>,
        reactProjectPath
      });

    case 'learn_from_changes':
      return await learnFromChanges({
        targetFiles: args?.targetFiles as string[],
        reactProjectPath
      });

    default:
      // 返回错误信息而不是抛出异常
      return {
        content: [
          {
            type: 'text',
            text: '工具不存在'
          }
        ]
      };
  }

});

// 启动服务器
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
}); 
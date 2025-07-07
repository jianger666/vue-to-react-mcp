import path from 'path';
import { readFile, findFiles } from '../utils/fileOperations.js';
import { logger } from '../utils/logger.js';

interface MigratePageOptions {
  pageName: string;
  vueFilePath?: string;
  vueProjectPath: string;
  reactProjectPath: string;
}

export async function migratePage(options: MigratePageOptions) {
  const { pageName, vueFilePath, vueProjectPath, reactProjectPath } = options;
  
  logger.info('Starting page migration', { pageName, vueFilePath, vueProjectPath });
  
  try {
    // 1. 查找 Vue 文件
    let vueFile: string;
    if (vueFilePath) {
      vueFile = path.join(vueProjectPath, vueFilePath);
    } else {
      // 自动搜索 Vue 文件
      const vueFiles = await findFiles(vueProjectPath, /\.vue$/);
      logger.info('Found Vue files', { count: vueFiles.length });
      
      // 简单的文件名匹配
      const matchedFiles = vueFiles.filter(file => {
        const fileName = path.basename(file, '.vue').toLowerCase();
        const searchName = pageName.toLowerCase();
        return fileName.includes(searchName) || 
               fileName.includes(searchName.replace(/\s+/g, '')) ||
               fileName.includes(searchName.replace(/\s+/g, '-')) ||
               fileName.includes(searchName.replace(/\s+/g, '_'));
      });
      
      if (matchedFiles.length === 0) {
        // 提供简洁的错误信息，让AI引导用户
        const availableFiles = vueFiles.map(f => path.relative(vueProjectPath, f));
        throw new Error(`无法根据页面名称 "${pageName}" 自动找到对应的 Vue 文件。

请用户提供具体的文件相对路径。例如：
- src/views/order/CreateOrder.vue
- src/pages/user/UserList.vue

项目中的 Vue 文件列表：
${availableFiles.slice(0, 20).join('\n')}${availableFiles.length > 20 ? `\n... 还有 ${availableFiles.length - 20} 个文件` : ''}`);
      }
      
      vueFile = matchedFiles[0];
      logger.info('Matched Vue file', { file: vueFile });
    }
    
    // 2. 读取 Vue 文件内容
    const vueContent = await readFile(vueFile);
    
    // 3. 读取路由配置
    const routerConfigPath = path.join(vueProjectPath, 'src/router/router.config.js');
    let routerContent = '';
    try {
      routerContent = await readFile(routerConfigPath);
    } catch (error) {
      logger.warn('Could not read router config', error);
    }
    
    // 4. 读取 MIGRATION_GUIDE.md
    const migrationGuidePath = path.join(reactProjectPath, 'MIGRATION_GUIDE.md');
    const migrationGuide = await readFile(migrationGuidePath);
    
    // 5. 构建响应 - 符合 MCP 的响应格式
    const responseText = `## Vue 页面分析结果

**找到的 Vue 文件**: \`${path.relative(vueProjectPath, vueFile)}\`

### Vue 组件内容
\`\`\`vue
${vueContent}
\`\`\`

### 路由配置
${routerContent ? `\`\`\`javascript
${routerContent}
\`\`\`

请根据上述路由配置，提议相应的路由修改。` : '未找到路由配置文件。'}

### 迁移指南

请参考以下迁移指南制定迁移计划：

${migrationGuide}

---

**下一步**: 请基于以上信息，生成：
1. 路由修改建议
2. 详细的迁移实施清单

等待用户批准后再执行迁移。`;
    
    return {
      content: [
        {
          type: 'text',
          text: responseText
        }
      ]
    };
  } catch (error) {
    logger.error('Migration failed', error);
    throw error;
  }
} 
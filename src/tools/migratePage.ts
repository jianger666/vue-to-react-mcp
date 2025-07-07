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
  
  logger.info('Starting page migration', { pageName, vueFilePath });
  
  try {
    // 1. 查找 Vue 文件
    let vueFile: string;
    if (vueFilePath) {
      vueFile = path.join(vueProjectPath, vueFilePath);
    } else {
      // 自动搜索 Vue 文件
      const vueFiles = await findFiles(vueProjectPath, /\.vue$/);
      const matchedFiles = vueFiles.filter(file => 
        file.toLowerCase().includes(pageName.toLowerCase().replace(/\s+/g, '-'))
      );
      
      if (matchedFiles.length === 0) {
        throw new Error(`未找到与 "${pageName}" 相关的 Vue 文件`);
      }
      
      vueFile = matchedFiles[0];
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
import path from 'path';
import { getGitDiff } from '../utils/gitOperations.js';
import { readFile } from '../utils/fileOperations.js';
import { logger } from '../utils/logger.js';
import { diffLines } from 'diff';

interface LearnFromChangesOptions {
  targetDirectory: string;
  lastGeneratedCode?: string;
  reactProjectPath: string;
}

export async function learnFromChanges(
  options: LearnFromChangesOptions
) {
  const { targetDirectory, lastGeneratedCode, reactProjectPath } = options;
  
  logger.info('Learning from changes', { targetDirectory });
  
  try {
    // 1. 获取目标目录的完整路径
    const fullTargetPath = path.isAbsolute(targetDirectory) 
      ? targetDirectory 
      : path.join(reactProjectPath, targetDirectory);
    
    // 2. 获取 Git diff
    let gitDiff = '';
    try {
      gitDiff = await getGitDiff(reactProjectPath, targetDirectory);
    } catch (error) {
      logger.warn('Could not get git diff', error);
    }
    
    // 3. 读取当前的 MIGRATION_GUIDE.md
    const migrationGuidePath = path.join(reactProjectPath, 'MIGRATION_GUIDE.md');
    const currentGuide = await readFile(migrationGuidePath);
    
    // 4. 如果提供了最后生成的代码，进行比较
    let codeDiff = '';
    if (lastGeneratedCode) {
      // 这里应该读取实际的文件内容进行比较
      // 但为了简化，我们假设 lastGeneratedCode 是之前的内容
      codeDiff = '代码差异分析将基于 Git diff 进行';
    }
    
    // 5. 构建响应 - 符合 MCP 的响应格式
    const responseText = `## 代码变更分析

**目标目录**: \`${targetDirectory}\`

### Git Diff 分析
${gitDiff ? `\`\`\`diff
${gitDiff}
\`\`\`

基于以上差异，我发现了以下变更点：
1. [请分析具体的变更内容]
2. [提炼出可复用的模式]
3. [识别新的最佳实践]` : '未检测到 Git 变更，可能文件尚未提交。'}

### 当前迁移指南

\`\`\`markdown
${currentGuide}
\`\`\`

### 学习总结

基于代码变更分析，我建议对 MIGRATION_GUIDE.md 进行以下更新：

1. **需要修改的规则**：
   - [具体哪条规则需要完善]
   - [如何使其更通用]

2. **需要新增的规则**：
   - [发现的新模式]
   - [新的最佳实践]

3. **可以合并或精简的规则**：
   - [哪些规则有重复]
   - [如何提炼共性]

---

**下一步**: 请审阅以上学习总结，确认后我将更新 MIGRATION_GUIDE.md。`;
    
    return {
      content: [
        {
          type: 'text',
          text: responseText
        }
      ]
    };
  } catch (error) {
    logger.error('Learning from changes failed', error);
    throw error;
  }
} 
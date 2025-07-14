import path from 'path';
import { readFile, readAIBaseline } from '../utils/fileOperations';
import { readPromptMarkdown } from '../prompts';
import { getMigrationGuidePath } from '../utils/fileOperations';

interface LearnFromChangesOptions {
  targetFiles: string[];
  reactProjectPath: string;
}

export async function learnFromChanges(
  options: LearnFromChangesOptions
) {
  const { targetFiles, reactProjectPath } = options;

  // 1. 处理多个文件
  const fileAnalyses: Array<{
    filePath: string;
    hasBaseline: boolean;
    aiVersion: string;
    currentVersion: string;
  }> = [];

  for (const targetFile of targetFiles) {
    // 读取 AI 基准版本
    let aiVersion = '';
    let hasBaseline = false;
    try {
      aiVersion = await readAIBaseline(reactProjectPath, targetFile);
      hasBaseline = true;
    } catch (error) {
      // 没有基准版本
    }
    
    // 读取用户修改后的当前版本
    let currentVersion = '';
    try {
      const currentPath = path.join(reactProjectPath, targetFile);
      currentVersion = await readFile(currentPath);
    } catch (error) {
      currentVersion = '无法读取当前文件';
    }

    fileAnalyses.push({
      filePath: targetFile,
      hasBaseline,
      aiVersion,
      currentVersion
    });
  }
  
  // 2. 读取当前的 MIGRATION_GUIDE.md
  const migrationGuidePath = getMigrationGuidePath(reactProjectPath);
  let currentGuide = '';
  try {
    currentGuide = await readFile(migrationGuidePath);
  } catch (error) {
    currentGuide = '未找到迁移指南文件';
  }
  
  // 3. 构建文件分析结果文本
  const fileAnalysesText = fileAnalyses.map((analysis, index) => {
    const status = analysis.hasBaseline ? '有基准版本' : '无基准版本';
    
    if (!analysis.hasBaseline) {
      return `${analysis.filePath}: ${status}\n当前版本:\n${analysis.currentVersion}\n`;
    }
    
    return `${analysis.filePath}: ${status}
AI基准版本:
${analysis.aiVersion}

用户修改版本:
${analysis.currentVersion}
`;
  }).join('\n---\n');
  
  return {
    content: [
      {
        type: 'text',
        text: readPromptMarkdown('promptWords/learnFromChangesSuccess.md', {
          fileAnalyses: fileAnalysesText,
          currentGuide,
          migrationGuidePath
        })
      }
    ]
  };
} 
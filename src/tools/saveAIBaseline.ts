import { saveAIBaseline as saveBaseline } from '../utils/fileOperations';
import { readPromptMarkdown } from '../prompts';

interface SaveAIBaselineOptions {
  files: Array<{
    filePath: string;
    content: string;
  }>;
  reactProjectPath: string;
}

export async function saveAIBaseline(options: SaveAIBaselineOptions) {
  const { files, reactProjectPath } = options;

  const results: Array<{
    filePath: string;
    success: boolean;
    error?: string;
  }> = [];

  // 保存每个文件的基准版本
  for (const file of files) {
    try {
      await saveBaseline(reactProjectPath, file.filePath, file.content);
      results.push({
        filePath: file.filePath,
        success: true
      });
    } catch (error) {
      results.push({
        filePath: file.filePath,
        success: false,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  const successCount = results.filter(r => r.success).length;


  // 构建保存结果详情
  const failedFiles = results.filter(r => !r.success);
  
  let saveResults = `成功保存 ${successCount}/${files.length} 个文件`;
  
  if (failedFiles.length > 0) {
    saveResults += `\n\n失败的文件:\n${failedFiles.map(f => `- ${f.filePath}: ${f.error}`).join('\n')}`;
  }
  
  saveResults += `\n\n文件保存在: ${reactProjectPath}/.ai-baseline/`;

  // 构建成功保存的文件列表
  const savedFilesList = results
    .filter(r => r.success)
    .map(r => `"${r.filePath}"`)
    .join(', ');

  return {
    content: [
      {
        type: 'text',
        text: readPromptMarkdown('promptWords/saveAIBaselineSuccess.md', {
          saveResults,
          savedFilesList
        })
      }
    ]
  };
} 
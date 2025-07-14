import path from 'path';
import fs from 'fs-extra';
import { readPromptMarkdown } from '../prompts';



/**
 * 获取源应用信息的选项接口
 */
interface GetFromApplicationOptions {
  vueProjectPath: string;  // Vue 项目根目录路径
  reactProjectPath: string;  // React 项目根目录路径
}

/**
 * 获取源应用（Vue项目）的信息，为AI提供自主读写能力
 * 
 * @param options 获取选项配置
 * @returns 包含源应用信息的响应对象
 */
export async function getFromApplication(options: GetFromApplicationOptions) {
  const { vueProjectPath, reactProjectPath } = options;

  // 获取绝对路径
  const vueAbsolutePath = path.resolve(vueProjectPath);

  // 构建响应消息
  return {
    content: [
      {
        type: 'text',
        text: readPromptMarkdown('promptWords/getFromApplicationSuccess.md', {
          vueAbsolutePath,
        })
      }
    ]
  };

} 
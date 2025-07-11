import fs from 'fs';
import path from 'path';

/**
 * 通用读取 Markdown 文件内容的方法，并支持动态变量替换
 * @param relativePath 相对于 src/prompts 目录的路径，如 'promptWords/getFromApplicationSuccess.md'
 * @param variables 用于替换md中的动态占位符（如{{key}}）的对象
 * @returns 文件内容字符串
 */
export function readPromptMarkdown(relativePath: string, variables: Record<string, string> = {}): string {
  const mdPath = path.resolve(__dirname, relativePath);
  let content = fs.readFileSync(mdPath, 'utf-8');
  for (const [key, value] of Object.entries(variables)) {
    const reg = new RegExp(`{{${key}}}`, 'g');
    content = content.replace(reg, value);
  }
  return content;
}

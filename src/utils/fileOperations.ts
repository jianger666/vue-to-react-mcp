import fs from 'fs-extra';
import path from 'path';

export async function readFile(filePath: string): Promise<string> {
  try {
    return await fs.readFile(filePath, 'utf-8');
  } catch (error) {
    throw error;
  }
}

/**
 * 迁移指南文件名常量
 */
export const MIGRATION_GUIDE_FILENAME = 'MIGRATION_GUIDE.md';

/**
 * 获取迁移指南文件的完整路径
 * @param reactProjectPath React项目根目录路径
 * @returns 迁移指南文件的完整路径
 */
export function getMigrationGuidePath(reactProjectPath: string): string {
  return path.join(reactProjectPath, MIGRATION_GUIDE_FILENAME);
}

export const  getMigrationGuide = async (reactProjectPath: string) => {
  const guidePath = getMigrationGuidePath(reactProjectPath);
  const exists = await fs.pathExists(guidePath);

  let migrationGuide = '';
  if (exists) {
    migrationGuide = await fs.readFile(guidePath, 'utf-8');
  } else {
    const templatePath = path.join(__dirname, '..', 'templates', 'MIGRATION_GUIDE_TEMPLATE.md');
    const templateContent = await fs.readFile(templatePath, 'utf-8');
    // 如果迁移指南不存在，则写入迁移指南
    await fs.writeFile(guidePath, templateContent, 'utf-8');
    migrationGuide = templateContent;
  }
  return migrationGuide;
}

/**
 * 保存 AI 生成的基准版本
 */
export async function saveAIBaseline(
  reactProjectPath: string,
  filePath: string,
  content: string
): Promise<void> {
  const baselinePath = path.join(reactProjectPath, '.ai-baseline', filePath);
  const metaPath = baselinePath + '.meta';

  // 确保目录存在
  await fs.mkdir(path.dirname(baselinePath), { recursive: true });

  // 保存文件内容
  await fs.writeFile(baselinePath, content, 'utf8');

  // 保存元数据
  await fs.writeFile(metaPath, JSON.stringify({
    createdAt: new Date().toISOString(),
    filePath
  }), 'utf8');

  // 清理过期文件
  await cleanExpiredBaselines(reactProjectPath);
}

/**
 * 清理超过3天的过期 baseline
 */
async function cleanExpiredBaselines(reactProjectPath: string): Promise<void> {
  const baselineDir = path.join(reactProjectPath, '.ai-baseline');

  try {
    const files = await fs.readdir(baselineDir, { recursive: true });
    const now = new Date();

    for (const file of files) {
      if (typeof file === 'string' && file.endsWith('.meta')) {
        const metaPath = path.join(baselineDir, file);
        const metaContent = await fs.readFile(metaPath, 'utf8');
        const { createdAt } = JSON.parse(metaContent);

        const createdDate = new Date(createdAt);
        const daysDiff = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24);

        if (daysDiff > 3) {
          const baselineFile = metaPath.replace('.meta', '');
          await fs.rm(baselineFile, { force: true });
          await fs.rm(metaPath, { force: true });
        }
      }
    }
  } catch (error) {
    // 静默处理错误
  }
}

/**
 * 读取 AI 基准版本
 */
export async function readAIBaseline(
  reactProjectPath: string,
  filePath: string
): Promise<string> {
  const baselinePath = path.join(reactProjectPath, '.ai-baseline', filePath);
  return await fs.readFile(baselinePath, 'utf8');
} 
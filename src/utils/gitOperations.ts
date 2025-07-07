import simpleGit, { SimpleGit } from 'simple-git';
import { logger } from './logger.js';

export async function getGitDiff(
  projectPath: string,
  filePath: string
): Promise<string> {
  const git: SimpleGit = simpleGit(projectPath);
  
  try {
    // 获取文件的 git diff
    const diff = await git.diff([filePath]);
    return diff;
  } catch (error) {
    logger.error(`Failed to get git diff for ${filePath}`, error);
    throw error;
  }
}

export async function getFileHistory(
  projectPath: string,
  filePath: string,
  limit: number = 10
): Promise<string[]> {
  const git: SimpleGit = simpleGit(projectPath);
  
  try {
    const log = await git.log({
      file: filePath,
      maxCount: limit
    });
    
    return log.all.map(commit => ({
      hash: commit.hash,
      date: commit.date,
      message: commit.message,
      author: commit.author_name
    })) as any;
  } catch (error) {
    logger.error(`Failed to get file history for ${filePath}`, error);
    throw error;
  }
} 

import { readPromptMarkdown } from '../prompts';

export async function continueMigratePage() {
  return {
    content: [
      {
        type: 'text',
        text: readPromptMarkdown('promptWords/continueMigratePageSuccess.md')
      }
    ]
  };
} 
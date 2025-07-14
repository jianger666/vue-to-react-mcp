
import { readPromptMarkdown } from '../prompts';
import { getMigrationGuide } from '../utils/fileOperations';

export async function migratePage(reactProjectPath: string) {


  const migrationGuide = await getMigrationGuide(reactProjectPath);


  return {
    content: [
      {
        type: 'text',
        text: readPromptMarkdown('promptWords/migratePageSuccess.md',{
          migrationGuide,
        })
      }
    ]
  };
} 
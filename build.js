const fs = require('fs-extra');
const { execSync } = require('child_process');

async function build() {
  try {
    // 编译 TypeScript
    console.log('编译 TypeScript...');
    execSync('tsc', { stdio: 'inherit' });
    
    // 复制 prompts 和 templates 目录
    console.log('复制资源文件...');
    await fs.copy('src/prompts', 'dist/prompts');
    await fs.copy('src/templates', 'dist/templates');
    
    console.log('构建完成！');
  } catch (error) {
    console.error('构建失败:', error);
    process.exit(1);
  }
}

build(); 
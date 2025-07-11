const fs = require('fs-extra');
const { spawn } = require('child_process');

async function dev() {
  try {
    // 复制 prompts 和 templates 目录
    console.log('复制资源文件...');
    await fs.copy('src/prompts', 'dist/prompts');
    await fs.copy('src/templates', 'dist/templates');
    console.log('资源文件复制完成！');
    
    // 启动 TypeScript watch 模式
    console.log('启动 TypeScript watch 模式...');
    const tscWatch = spawn('tsc', ['--watch'], { stdio: 'inherit' });
    
    tscWatch.on('close', (code) => {
      console.log(`TypeScript watch 进程退出，代码: ${code}`);
    });
    
  } catch (error) {
    console.error('开发模式启动失败:', error);
    process.exit(1);
  }
}

dev(); 
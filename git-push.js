#!/usr/bin/env node

/**
 * Git自动推送脚本
 * 自动检查、提交和推送代码到GitHub
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step, message) {
  log(`\n[${step}] ${message}`, 'cyan');
}

function logSuccess(message) {
  log(`✓ ${message}`, 'green');
}

function logError(message) {
  log(`✗ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠ ${message}`, 'yellow');
}

// 执行命令并返回输出
function runCommand(command, options = {}) {
  try {
    const output = execSync(command, {
      encoding: 'utf-8',
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options
    });
    return { success: true, output };
  } catch (error) {
    return { success: false, error: error.message, output: error.stdout };
  }
}

// 获取用户输入
function getUserInput(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

// 检查Git是否初始化
function checkGitInit() {
  logStep('1/5', '检查Git仓库');
  
  const gitDir = path.join(process.cwd(), '.git');
  if (!fs.existsSync(gitDir)) {
    logWarning('未初始化Git仓库');
    return false;
  }
  
  logSuccess('Git仓库已初始化');
  return true;
}

// 初始化Git仓库
async function initGitRepo() {
  log('初始化Git仓库...');
  
  const result = runCommand('git init');
  if (!result.success) {
    logError('Git初始化失败');
    return false;
  }
  
  logSuccess('Git仓库初始化成功');
  
  // 检查是否有远程仓库
  const remotes = runCommand('git remote -v', { silent: true });
  if (!remotes.output || !remotes.output.includes('origin')) {
    logWarning('未配置远程仓库');
    log('\n请输入GitHub仓库URL (例如: https://github.com/username/repo.git):');
    const repoUrl = await getUserInput('> ');
    
    if (repoUrl) {
      const addRemote = runCommand(`git remote add origin ${repoUrl}`);
      if (addRemote.success) {
        logSuccess('远程仓库配置成功');
      } else {
        logError('远程仓库配置失败');
        return false;
      }
    }
  }
  
  return true;
}

// 检查Git状态
function checkGitStatus() {
  logStep('2/5', '检查文件状态');
  
  const status = runCommand('git status --porcelain', { silent: true });
  if (!status.success) {
    logError('无法获取Git状态');
    return null;
  }
  
  const changes = status.output.trim();
  if (!changes) {
    logSuccess('没有待提交的更改');
    return { hasChanges: false, changes: '' };
  }
  
  log('\n待提交的更改:');
  log(changes);
  
  return { hasChanges: true, changes };
}

// 添加文件
function addFiles() {
  logStep('3/5', '添加文件到暂存区');
  
  log('执行: git add .');
  const result = runCommand('git add .');
  
  if (!result.success) {
    logError('添加文件失败');
    return false;
  }
  
  logSuccess('文件已添加到暂存区');
  return true;
}

// 提交更改
async function commitChanges() {
  logStep('4/5', '提交更改');
  
  // 生成默认提交消息
  const timestamp = new Date().toISOString().split('T')[0];
  const defaultMessage = `Update: ${timestamp}`;
  
  log(`\n请输入提交消息 (直接按Enter使用默认: "${defaultMessage}"):`);
  const message = await getUserInput('> ');
  
  const commitMessage = message || defaultMessage;
  
  log(`\n提交消息: ${commitMessage}`);
  const result = runCommand(`git commit -m "${commitMessage}"`);
  
  if (!result.success) {
    if (result.error.includes('nothing to commit')) {
      logWarning('没有需要提交的更改');
      return true;
    }
    logError('提交失败');
    return false;
  }
  
  logSuccess('提交成功');
  return true;
}

// 推送到远程仓库
async function pushToRemote() {
  logStep('5/5', '推送到GitHub');
  
  // 检查是否有远程仓库
  const remotes = runCommand('git remote -v', { silent: true });
  if (!remotes.output || !remotes.output.includes('origin')) {
    logError('未配置远程仓库');
    log('\n请先配置远程仓库:');
    log('git remote add origin <repository-url>');
    return false;
  }
  
  // 获取当前分支
  const branchResult = runCommand('git branch --show-current', { silent: true });
  const currentBranch = branchResult.output ? branchResult.output.trim() : 'main';
  
  log(`当前分支: ${currentBranch}`);
  
  // 检查是否是第一次推送
  const hasUpstream = runCommand(`git rev-parse --abbrev-ref ${currentBranch}@{upstream}`, { silent: true });
  const isFirstPush = !hasUpstream.success;
  
  if (isFirstPush) {
    log('首次推送，设置上游分支...');
    const result = runCommand(`git push -u origin ${currentBranch}`);
    
    if (!result.success) {
      logError('推送失败');
      
      // 可能需要设置默认分支名
      if (result.error.includes('main')) {
        logWarning('尝试重命名分支为main...');
        runCommand('git branch -M main');
        const retryResult = runCommand('git push -u origin main');
        
        if (retryResult.success) {
          logSuccess('推送成功');
          return true;
        }
      }
      
      log('\n可能的原因:');
      log('1. 远程仓库不存在或URL错误');
      log('2. 没有推送权限');
      log('3. 需要先在GitHub创建仓库');
      return false;
    }
  } else {
    log('推送到远程仓库...');
    const result = runCommand('git push');
    
    if (!result.success) {
      logError('推送失败');
      return false;
    }
  }
  
  logSuccess('推送成功');
  
  // 显示远程仓库信息
  const remoteUrl = runCommand('git remote get-url origin', { silent: true });
  if (remoteUrl.success) {
    const url = remoteUrl.output.trim();
    // 转换SSH URL为HTTPS
    const httpsUrl = url.replace(/^git@github\.com:/, 'https://github.com/').replace(/\.git$/, '');
    log(`\nGitHub仓库: ${httpsUrl}`, 'green');
  }
  
  return true;
}

// 主函数
async function main() {
  log('\n' + '='.repeat(60), 'blue');
  log('Git自动推送脚本', 'blue');
  log('='.repeat(60) + '\n', 'blue');
  
  try {
    // 1. 检查Git是否初始化
    let gitInitialized = checkGitInit();
    
    if (!gitInitialized) {
      log('\n是否初始化Git仓库? (y/n)');
      const answer = await getUserInput('> ');
      
      if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        gitInitialized = await initGitRepo();
        if (!gitInitialized) {
          process.exit(1);
        }
      } else {
        logError('需要Git仓库才能继续');
        process.exit(1);
      }
    }
    
    // 2. 检查状态
    const status = checkGitStatus();
    if (!status) {
      process.exit(1);
    }
    
    if (!status.hasChanges) {
      log('\n没有需要推送的更改');
      
      // 尝试推送已有的提交
      const hasCommits = runCommand('git log -1', { silent: true });
      if (hasCommits.success) {
        log('\n是否推送现有提交? (y/n)');
        const answer = await getUserInput('> ');
        
        if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
          await pushToRemote();
        }
      }
      
      return;
    }
    
    // 3. 添加文件
    const added = addFiles();
    if (!added) {
      process.exit(1);
    }
    
    // 4. 提交更改
    const committed = await commitChanges();
    if (!committed) {
      process.exit(1);
    }
    
    // 5. 推送到远程
    const pushed = await pushToRemote();
    if (!pushed) {
      process.exit(1);
    }
    
    log('\n' + '='.repeat(60), 'green');
    logSuccess('所有操作完成！');
    log('='.repeat(60) + '\n', 'green');
    
  } catch (error) {
    logError(`\n发生错误: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

// 运行主函数
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main };

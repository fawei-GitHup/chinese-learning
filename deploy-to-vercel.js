#!/usr/bin/env node

/**
 * Vercel自动化部署脚本
 * 使用Playwright自动化登录Vercel并部署项目
 */

const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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

// 读取环境变量
function loadEnvFile() {
  logStep('1/7', '检查环境变量配置');
  
  const envPath = path.join(process.cwd(), '.env.local');
  
  if (!fs.existsSync(envPath)) {
    logError('.env.local 文件不存在');
    log('\n请创建.env.local文件并配置以下变量：');
    log('VERCEL_EMAIL=your-email@example.com');
    log('VERCEL_PASSWORD=your-password');
    log('GITHUB_REPO_URL=https://github.com/username/repo');
    log('PROJECT_NAME=your-project-name');
    process.exit(1);
  }

  const envContent = fs.readFileSync(envPath, 'utf-8');
  const envVars = {};
  
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join('=').trim();
      }
    }
  });

  // 检查必需变量
  const requiredVars = ['VERCEL_EMAIL', 'VERCEL_PASSWORD'];
  const missingVars = requiredVars.filter(v => !envVars[v] || envVars[v] === 'your-email@example.com' || envVars[v] === 'your-password');
  
  if (missingVars.length > 0) {
    logError(`以下环境变量未配置或使用了默认值: ${missingVars.join(', ')}`);
    log('\n请在.env.local中填写真实的凭据信息');
    process.exit(1);
  }

  logSuccess('环境变量配置检查通过');
  return envVars;
}

// 检查构建
function checkBuild() {
  logStep('2/7', '检查项目构建');
  
  try {
    log('执行 npm run build...');
    execSync('npm run build', { stdio: 'inherit' });
    logSuccess('构建成功');
    return true;
  } catch (error) {
    logError('构建失败，请修复错误后重试');
    return false;
  }
}

// 检查Git状态
function checkGitStatus() {
  logStep('3/7', '检查Git状态');
  
  if (!fs.existsSync(path.join(process.cwd(), '.git'))) {
    logWarning('未初始化Git仓库');
    log('是否需要初始化? 可以使用: git init && git add . && git commit -m "Initial commit"');
    return false;
  }

  try {
    const status = execSync('git status --porcelain', { encoding: 'utf-8' });
    if (status.trim()) {
      logWarning('存在未提交的更改:');
      log(status);
      log('\n提示: 运行 node git-push.js 来自动提交和推送');
      return false;
    }
    logSuccess('Git状态干净');
    return true;
  } catch (error) {
    logWarning('无法检查Git状态');
    return false;
  }
}

// 检查GitHub远程仓库
function checkGitHubRepo() {
  logStep('4/7', '检查GitHub仓库');
  
  try {
    const remotes = execSync('git remote -v', { encoding: 'utf-8' });
    if (!remotes.includes('github.com')) {
      logWarning('未配置GitHub远程仓库');
      log('请先配置GitHub仓库: git remote add origin <repository-url>');
      return null;
    }
    
    // 提取GitHub仓库URL
    const match = remotes.match(/github\.com[:/]([^/]+)\/([^\s.]+)/);
    if (match) {
      const owner = match[1];
      const repo = match[2];
      const repoUrl = `https://github.com/${owner}/${repo}`;
      logSuccess(`GitHub仓库: ${repoUrl}`);
      return repoUrl;
    }
  } catch (error) {
    logWarning('无法获取GitHub仓库信息');
  }
  
  return null;
}

// Playwright自动化部署
async function deployToVercel(envVars, githubRepoUrl) {
  logStep('5/7', '启动Playwright自动化部署');
  
  const browser = await chromium.launch({ 
    headless: false, // 设为false以便观察过程
    slowMo: 500 // 减慢操作速度，便于观察
  });
  
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  
  const page = await context.newPage();
  
  try {
    // 1. 访问Vercel登录页
    log('访问Vercel登录页...');
    await page.goto('https://vercel.com/login', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    // 2. 选择Email登录
    log('选择Email登录方式...');
    const emailButton = page.locator('button:has-text("Continue with Email"), a:has-text("Continue with Email")');
    if (await emailButton.count() > 0) {
      await emailButton.first().click();
      await page.waitForTimeout(1000);
    }
    
    // 3. 输入邮箱
    log('输入邮箱地址...');
    const emailInput = page.locator('input[type="email"], input[name="email"]');
    await emailInput.fill(envVars.VERCEL_EMAIL);
    await page.waitForTimeout(500);
    
    // 4. 点击Continue
    const continueButton = page.locator('button:has-text("Continue"), button[type="submit"]');
    await continueButton.click();
    await page.waitForTimeout(2000);
    
    // 5. 输入密码
    log('输入密码...');
    const passwordInput = page.locator('input[type="password"], input[name="password"]');
    await passwordInput.fill(envVars.VERCEL_PASSWORD);
    await page.waitForTimeout(500);
    
    // 6. 登录
    log('点击登录...');
    const loginButton = page.locator('button:has-text("Continue"), button[type="submit"]');
    await loginButton.click();
    
    // 等待登录完成（可能需要2FA或跳转）
    log('等待登录完成...');
    await page.waitForTimeout(5000);
    
    // 检查是否需要2FA
    const twoFactorInput = page.locator('input[name="code"], input[placeholder*="code"]');
    if (await twoFactorInput.count() > 0) {
      logWarning('检测到需要2FA验证码');
      log('请在浏览器中手动输入2FA验证码，然后按Enter继续...');
      await page.waitForTimeout(60000); // 等待1分钟用于手动输入
    }
    
    // 7. 检查是否登录成功
    await page.waitForURL('**/dashboard/**', { timeout: 30000 }).catch(() => {});
    
    if (page.url().includes('dashboard')) {
      logSuccess('登录成功！');
    } else {
      logWarning('登录状态不确定，尝试继续...');
    }
    
    await page.waitForTimeout(2000);
    
    // 8. 创建新项目
    logStep('6/7', '导入GitHub项目');
    
    if (!githubRepoUrl) {
      logWarning('未提供GitHub仓库URL，请手动在Vercel中导入项目');
      log('浏览器将保持打开状态，请手动完成剩余步骤');
      await page.waitForTimeout(300000); // 等待5分钟
      return;
    }
    
    log('访问新项目页面...');
    await page.goto('https://vercel.com/new', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    // 9. 导入GitHub仓库
    log('查找并导入GitHub仓库...');
    
    // 查找仓库搜索框或导入按钮
    const importInput = page.locator('input[placeholder*="Search"], input[placeholder*="repository"]');
    if (await importInput.count() > 0) {
      await importInput.fill(githubRepoUrl);
      await page.waitForTimeout(2000);
      
      // 点击Import按钮
      const importButton = page.locator('button:has-text("Import")').first();
      if (await importButton.count() > 0) {
        await importButton.click();
        await page.waitForTimeout(3000);
      }
    }
    
    // 10. 配置项目
    log('配置项目设置...');
    
    // 项目名称
    const projectNameInput = page.locator('input[name="name"], input[placeholder*="project"]');
    if (await projectNameInput.count() > 0 && envVars.PROJECT_NAME) {
      await projectNameInput.fill(envVars.PROJECT_NAME);
    }
    
    // 框架检测（Next.js应该自动检测）
    logSuccess('Vercel应该自动检测Next.js项目配置');
    
    await page.waitForTimeout(2000);
    
    // 11. 环境变量配置
    log('配置环境变量...');
    
    // 查找环境变量部分
    const envSection = page.locator('text=Environment Variables, button:has-text("Environment")');
    if (await envSection.count() > 0) {
      await envSection.first().click();
      await page.waitForTimeout(1000);
      
      // 这里可以添加环境变量，但通常在部署后再手动配置
      logWarning('建议部署后在项目设置中手动配置环境变量');
    }
    
    // 12. 触发部署
    logStep('7/7', '触发部署');
    log('点击Deploy按钮...');
    
    const deployButton = page.locator('button:has-text("Deploy")');
    if (await deployButton.count() > 0) {
      await deployButton.click();
      logSuccess('部署已触发！');
      
      // 等待部署页面加载
      await page.waitForTimeout(5000);
      
      log('部署进行中，监控部署状态...');
      
      // 等待部署完成（最多10分钟）
      let deploymentComplete = false;
      let attempts = 0;
      const maxAttempts = 60; // 10分钟
      
      while (!deploymentComplete && attempts < maxAttempts) {
        await page.waitForTimeout(10000); // 每10秒检查一次
        attempts++;
        
        // 检查是否有完成标识
        const successIndicator = page.locator('text=Deployment Complete, text=Visit, text=Production');
        const errorIndicator = page.locator('text=Failed, text=Error');
        
        if (await successIndicator.count() > 0) {
          deploymentComplete = true;
          logSuccess('�署完成！');
          
          // 尝试获取部署URL
          const visitLink = page.locator('a:has-text("Visit"), a[href*=".vercel.app"]');
          if (await visitLink.count() > 0) {
            const deployUrl = await visitLink.first().getAttribute('href');
            log('\n' + '='.repeat(60), 'green');
            log(`部署URL: ${deployUrl}`, 'green');
            log('='.repeat(60), 'green');
          }
          break;
        } else if (await errorIndicator.count() > 0) {
          logError('部署失败！请检查Vercel控制台获取详细错误信息');
          break;
        }
        
        log(`等待部署完成... (${attempts * 10}秒)`);
      }
      
      if (!deploymentComplete && attempts >= maxAttempts) {
        logWarning('部署超时，请手动检查Vercel控制台');
      }
      
      // 保持浏览器打开以便查看
      log('\n浏览器将保持打开30秒，以便您查看结果...');
      await page.waitForTimeout(30000);
      
    } else {
      logWarning('未找到Deploy按钮，可能需要手动操作');
      log('浏览器将保持打开状态，请手动完成部署');
      await page.waitForTimeout(300000);
    }
    
  } catch (error) {
    logError(`部署过程出错: ${error.message}`);
    log('浏览器将保持打开状态，请手动完成剩余步骤...');
    await page.waitForTimeout(300000);
  } finally {
    await browser.close();
  }
}

// 主函数
async function main() {
  log('\n' + '='.repeat(60), 'blue');
  log('Vercel自动化部署脚本', 'blue');
  log('='.repeat(60) + '\n', 'blue');
  
  try {
    // 1. 加载环境变量
    const envVars = loadEnvFile();
    
    // 2. 检查构建
    const buildSuccess = checkBuild();
    if (!buildSuccess) {
      logError('构建失败，终止部署');
      process.exit(1);
    }
    
    // 3. 检查Git状态
    const gitClean = checkGitStatus();
    
    // 4. 检查GitHub仓库
    const githubRepoUrl = checkGitHubRepo();
    
    if (!gitClean || !githubRepoUrl) {
      logWarning('\n建议先运行: node git-push.js');
      log('或手动执行: git add . && git commit -m "message" && git push');
      log('\n是否继续部署? (可能需要手动操作)');
      log('按Ctrl+C取消，或等待5秒自动继续...\n');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
    
    // 5. 执行自动化部署
    await deployToVercel(envVars, githubRepoUrl);
    
    log('\n' + '='.repeat(60), 'green');
    logSuccess('部署流程完成！');
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

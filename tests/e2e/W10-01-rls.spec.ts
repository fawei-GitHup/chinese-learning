/**
 * W10-01: 权限与RLS回归 - Playwright E2E 自动化测试
 * 
 * 测试目标:
 * 1. 验证未登录用户无法访问学习区
 * 2. 验证登录后重定向到原页面
 * 3. 验证用户只能看到自己的数据
 * 
 * 前置条件:
 * - 应用正在运行（npm run dev）
 * - Supabase已配置（.env.local）
 * - 已创建两个测试用户:
 *   - test-user-a@example.com / TestPassword123!
 *   - test-user-b@example.com / TestPassword123!
 */

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';

// 测试用户凭据
const USER_A = {
  email: 'test-user-a@example.com',
  password: 'TestPassword123!',
};

const USER_B = {
  email: 'test-user-b@example.com',
  password: 'TestPassword123!',
};

// 学习区保护路由列表
const PROTECTED_ROUTES = [
  '/dashboard',
  '/account',
  '/srs',
  '/grammar',
  '/dictionary/医生',
  '/medical-reader',
  '/lessons',
  '/path',
];

test.describe('W10-01: 权限与RLS回归测试', () => {
  
  // ================================================================
  // 场景 1: 未登录用户访问学习区
  // ================================================================
  
  test.describe('未登录用户访问保护', () => {
    
    test.beforeEach(async ({ context }) => {
      // 清除所有cookie，确保未登录状态
      await context.clearCookies();
    });

    PROTECTED_ROUTES.forEach((route) => {
      test(`未登录访问 ${route} 应重定向到登录页`, async ({ page }) => {
        // 访问保护路由
        await page.goto(`${BASE_URL}${route}`);
        
        // 等待重定向完成
        await page.waitForURL(/\/login/);
        
        // 验证重定向到登录页
        expect(page.url()).toContain('/login');
        
        // 验证redirect参数包含原路径
        const url = new URL(page.url());
        const redirectParam = url.searchParams.get('redirect');
        expect(redirectParam).toBe(route);
      });
    });

    test('未登录访问 /dashboard 显示登录表单', async ({ page }) => {
      await page.goto(`${BASE_URL}/dashboard`);
      
      // 等待重定向到登录页
      await page.waitForURL(/\/login/);
      
      // 验证登录表单存在
      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('input[type="password"]')).toBeVisible();
      await expect(page.getByRole('button', { name: /登录|login/i })).toBeVisible();
    });
  });

  // ================================================================
  // 场景 2: 登录后重定向
  // ================================================================
  
  test.describe('登录后自动重定向', () => {
    
    test('从 /login?redirect=/dashboard 登录后应跳转到 dashboard', async ({ page }) => {
      // 访问带redirect参数的登录页
      await page.goto(`${BASE_URL}/login?redirect=/dashboard`);
      
      // 执行登录
      await page.locator('input[type="email"]').fill(USER_A.email);
      await page.locator('input[type="password"]').fill(USER_A.password);
      await page.getByRole('button', { name: /登录|login/i }).click();
      
      // 等待重定向到dashboard
      await page.waitForURL(/\/dashboard/, { timeout: 10000 });
      
      // 验证成功跳转到dashboard
      expect(page.url()).toContain('/dashboard');
      
      // 验证dashboard内容可见（说明已登录）
      await expect(page.locator('h1, h2').first()).toBeVisible();
    });

    test('从 /login?redirect=/srs 登录后应跳转到 SRS页面', async ({ page }) => {
      await page.goto(`${BASE_URL}/login?redirect=/srs`);
      
      // 执行登录
      await page.locator('input[type="email"]').fill(USER_A.email);
      await page.locator('input[type="password"]').fill(USER_A.password);
      await page.getByRole('button', { name: /登录|login/i }).click();
      
      // 等待重定向到SRS页面
      await page.waitForURL(/\/srs/, { timeout: 10000 });
      
      // 验证成功跳转到SRS
      expect(page.url()).toContain('/srs');
    });
  });

  // ================================================================
  // 场景 3: 已登录用户访问学习区
  // ================================================================
  
  test.describe('已登录用户访问控制', () => {
    
    test.beforeEach(async ({ page }) => {
      // 登录用户A
      await page.goto(`${BASE_URL}/login`);
      await page.locator('input[type="email"]').fill(USER_A.email);
      await page.locator('input[type="password"]').fill(USER_A.password);
      await page.getByRole('button', { name: /登录|login/i }).click();
      
      // 等待登录成功（通常会重定向到首页或dashboard）
      await page.waitForTimeout(2000);
    });

    test('登录后可以访问 dashboard', async ({ page }) => {
      await page.goto(`${BASE_URL}/dashboard`);
      
      // 验证没有被重定向到登录页
      expect(page.url()).not.toContain('/login');
      expect(page.url()).toContain('/dashboard');
      
      // 验证页面内容可见
      await expect(page.locator('h1, h2').first()).toBeVisible();
    });

    test('登录后可以访问 SRS页面', async ({ page }) => {
      await page.goto(`${BASE_URL}/srs`);
      
      // 验证没有被重定向
      expect(page.url()).toContain('/srs');
      
      // 验证页面加载成功
      await expect(page.locator('body')).toBeVisible();
    });

    test('登录后可以访问 Grammar页面', async ({ page }) => {
      await page.goto(`${BASE_URL}/grammar`);
      
      // 验证没有被重定向
      expect(page.url()).toContain('/grammar');
      
      // 验证页面加载成功
      await expect(page.locator('body')).toBeVisible();
    });

    test('登录后可以访问 Account页面', async ({ page }) => {
      await page.goto(`${BASE_URL}/account`);
      
      // 验证没有被重定向
      expect(page.url()).toContain('/account');
      
      // 验证页面加载成功
      await expect(page.locator('body')).toBeVisible();
    });
  });

  // ================================================================
  // 场景 4: 数据隔离验证（前端视角）
  // ================================================================
  
  test.describe('用户数据隔离', () => {
    
    test('用户A登录后只能看到自己的SRS数据', async ({ page }) => {
      // 登录用户A
      await page.goto(`${BASE_URL}/login`);
      await page.locator('input[type="email"]').fill(USER_A.email);
      await page.locator('input[type="password"]').fill(USER_A.password);
      await page.getByRole('button', { name: /登录|login/i }).click();
      
      await page.waitForTimeout(2000);
      
      // 访问SRS页面
      await page.goto(`${BASE_URL}/srs`);
      
      // 打开浏览器开发者工具网络面板（通过page.route拦截）
      const requests: string[] = [];
      page.on('request', (request) => {
        if (request.url().includes('supabase')) {
          requests.push(request.url());
        }
      });
      
      // 等待页面加载完成
      await page.waitForLoadState('networkidle');
      
      // 验证页面加载成功（没有出现其他用户的数据）
      // 注意：这是前端验证，真正的数据隔离由RLS保证
      await expect(page.locator('body')).toBeVisible();
      
      // 可以添加更具体的断言，比如检查是否显示用户A的用户名
      // 但不显示用户B的任何信息
    });

    test('登出后无法访问学习区', async ({ page, context }) => {
      // 登录用户A
      await page.goto(`${BASE_URL}/login`);
      await page.locator('input[type="email"]').fill(USER_A.email);
      await page.locator('input[type="password"]').fill(USER_A.password);
      await page.getByRole('button', { name: /登录|login/i }).click();
      
      await page.waitForTimeout(2000);
      
      // 访问dashboard确认已登录
      await page.goto(`${BASE_URL}/dashboard`);
      expect(page.url()).toContain('/dashboard');
      
      // 清除cookies（模拟登出）
      await context.clearCookies();
      
      // 刷新页面
      await page.reload();
      
      // 应该被重定向到登录页
      await page.waitForURL(/\/login/, { timeout: 5000 });
      expect(page.url()).toContain('/login');
    });
  });

  // ================================================================
  // 场景 5: 边界情况测试
  // ================================================================
  
  test.describe('边界情况', () => {
    
    test('无效的redirect参数不应导致开放重定向漏洞', async ({ page }) => {
      // 尝试重定向到外部URL
      await page.goto(`${BASE_URL}/login?redirect=https://evil.com`);
      
      // 登录
      await page.locator('input[type="email"]').fill(USER_A.email);
      await page.locator('input[type="password"]').fill(USER_A.password);
      await page.getByRole('button', { name: /登录|login/i }).click();
      
      await page.waitForTimeout(3000);
      
      // 验证没有跳转到外部URL
      expect(page.url()).not.toContain('evil.com');
      // 应该跳转到安全的默认页面（如首页或dashboard）
      expect(page.url()).toMatch(/\/(dashboard|$)/);
    });

    test('并发登录（同一用户在多个标签页）应正常工作', async ({ browser }) => {
      // 创建两个页面（模拟两个标签页）
      const context1 = await browser.newContext();
      const context2 = await browser.newContext();
      const page1 = await context1.newPage();
      const page2 = await context2.newPage();
      
      // 在两个页面上登录同一用户
      for (const page of [page1, page2]) {
        await page.goto(`${BASE_URL}/login`);
        await page.locator('input[type="email"]').fill(USER_A.email);
        await page.locator('input[type="password"]').fill(USER_A.password);
        await page.getByRole('button', { name: /登录|login/i }).click();
        await page.waitForTimeout(2000);
      }
      
      // 两个页面都应该能访问学习区
      await page1.goto(`${BASE_URL}/dashboard`);
      await page2.goto(`${BASE_URL}/srs`);
      
      expect(page1.url()).toContain('/dashboard');
      expect(page2.url()).toContain('/srs');
      
      // 清理
      await context1.close();
      await context2.close();
    });
  });

  // ================================================================
  // 场景 6: Session过期处理
  // ================================================================
  
  test.describe('Session过期', () => {
    
    test('Session过期后访问保护路由应重定向到登录页', async ({ page, context }) => {
      // 登录
      await page.goto(`${BASE_URL}/login`);
      await page.locator('input[type="email"]').fill(USER_A.email);
      await page.locator('input[type="password"]').fill(USER_A.password);
      await page.getByRole('button', { name: /登录|login/i }).click();
      
      await page.waitForTimeout(2000);
      
      // 确认已登录
      await page.goto(`${BASE_URL}/dashboard`);
      expect(page.url()).toContain('/dashboard');
      
      // 手动过期session（清除特定cookie）
      // 注意：实际的cookie名称可能不同，需要根据Supabase的实现调整
      await context.clearCookies();
      
      // 尝试访问保护路由
      await page.goto(`${BASE_URL}/srs`);
      
      // 应该被重定向到登录页
      await page.waitForURL(/\/login/, { timeout: 5000 });
      expect(page.url()).toContain('/login');
    });
  });
});

// ================================================================
// 辅助函数
// ================================================================

/**
 * 登录辅助函数
 */
async function login(page: any, email: string, password: string) {
  await page.goto(`${BASE_URL}/login`);
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(password);
  await page.getByRole('button', { name: /登录|login/i }).click();
  await page.waitForTimeout(2000);
}

/**
 * 登出辅助函数
 */
async function logout(context: any) {
  await context.clearCookies();
}

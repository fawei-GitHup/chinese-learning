import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright配置文件 - W10-01 安全测试
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // 测试目录
  testDir: './tests/e2e',
  
  // 并行运行测试文件
  fullyParallel: true,
  
  // CI环境下失败时不重试，本地开发可重试一次
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  
  // CI环境下使用更少的worker
  workers: process.env.CI ? 1 : undefined,
  
  // 报告配置
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
    ['json', { outputFile: 'playwright-report/results.json' }]
  ],
  
  // 全局配置
  use: {
    // 基础URL
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000',
    
    // 失败时截图
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    
    // 视频录制（仅失败时）
    video: 'retain-on-failure',
    
    // 增加默认超时时间（Supabase认证可能较慢）
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },

  // 项目配置 - 不同浏览器
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // 可选：在其他浏览器上测试
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    // 移动端测试（可选）
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
  ],

  // Web服务器配置
  // 如果应用未运行，自动启动开发服务器
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});

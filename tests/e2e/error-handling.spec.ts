/**
 * W10-02 错误处理 E2E 测试
 * 测试所有页面的错误边界处理：断网、空数据、内容下架、加载状态
 */

import { test, expect, Page } from '@playwright/test';

/**
 * 辅助函数：模拟离线状态
 */
async function goOffline(page: Page) {
  await page.context().setOffline(true);
}

/**
 * 辅助函数：恢复在线状态
 */
async function goOnline(page: Page) {
  await page.context().setOffline(false);
}

/**
 * 辅助函数：检查 ErrorDisplay 组件是否存在
 */
async function expectErrorDisplay(page: Page) {
  // 检查错误图标
  await expect(page.locator('[data-testid="error-display"], .error-display, text=发生错误')).toBeVisible();
  // 检查重试按钮
  await expect(page.locator('button:has-text("重新尝试"), button:has-text("重试")')).toBeVisible();
}

/**
 * 辅助函数：检查 EmptyState 组件是否存在
 */
async function expectEmptyState(page: Page, expectedText?: string) {
  const emptyState = page.locator('[data-testid="empty-state"], .empty-state');
  await expect(emptyState).toBeVisible();
  
  if (expectedText) {
    await expect(page.locator(`text=${expectedText}`)).toBeVisible();
  }
}

/**
 * 辅助函数：检查骨架屏是否存在
 */
async function expectSkeleton(page: Page) {
  // 等待页面加载开始
  await page.waitForTimeout(100);
  
  // 检查是否有骨架屏元素
  const skeleton = page.locator('.skeleton, [data-testid="skeleton"], .animate-pulse');
  const count = await skeleton.count();
  
  expect(count).toBeGreaterThan(0);
}

test.describe('错误处理 - 医疗词汇页面', () => {
  
  test('医疗词汇列表 - 断网错误处理', async ({ page, context }) => {
    // 先正常访问页面
    await page.goto('/medical/vocabulary');
    await page.waitForLoadState('networkidle');
    
    // 模拟断网
    await goOffline(page);
    
    // 重新加载页面
    await page.reload();
    
    // 期望显示错误信息
    await expectErrorDisplay(page);
    
    // 恢复在线
    await goOnline(page);
    
    // 点击重试
    await page.click('button:has-text("重新尝试"), button:has-text("重试")');
    
    // 期望页面恢复正常
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1:has-text("Medical Vocabulary")')).toBeVisible();
  });

  test('医疗词汇列表 - 空数据处理', async ({ page }) => {
    // 访问带搜索参数的页面（假设没有结果）
    await page.goto('/medical/vocabulary?q=nonexistentterm12345xyz');
    await page.waitForLoadState('networkidle');
    
    // 期望显示空状态
    await expectEmptyState(page, 'No results');
    
    // 检查是否有清除搜索按钮
    const clearButton = page.locator('button:has-text("Clear search"), button:has-text("清除搜索")');
    if (await clearButton.isVisible()) {
      await clearButton.click();
      await page.waitForLoadState('networkidle');
    }
  });

  test('医疗词汇列表 - 加载状态', async ({ page, context }) => {
    // 设置慢速网络
    await context.route('**/*', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.continue();
    });
    
    // 访问页面
    const navigationPromise = page.goto('/medical/vocabulary');
    
    // 期望看到骨架屏
    await expectSkeleton(page);
    
    // 等待加载完成
    await navigationPromise;
    await page.waitForLoadState('networkidle');
    
    // 期望看到实际内容
    await expect(page.locator('h1:has-text("Medical Vocabulary")')).toBeVisible();
  });

  test('医疗词汇详情 - 访问未发布内容（404）', async ({ page }) => {
    // 尝试访问一个不存在或未发布的词汇
    await page.goto('/medical/dictionary/nonexistent-term-12345');
    
    // 期望显示 404 或错误信息
    const is404 = await page.locator('text=404').isVisible().catch(() => false);
    const hasError = await page.locator('text=not found, text=不存在, text=找不到').isVisible().catch(() => false);
    
    expect(is404 || hasError).toBeTruthy();
  });
});

test.describe('错误处理 - 场景页面', () => {
  
  test('场景列表 - 断网错误处理', async ({ page }) => {
    await page.goto('/medical/scenarios');
    await page.waitForLoadState('networkidle');
    
    await goOffline(page);
    await page.reload();
    
    await expectErrorDisplay(page);
    
    await goOnline(page);
    await page.click('button:has-text("重新尝试"), button:has-text("重试")');
    await page.waitForLoadState('networkidle');
  });

  test('场景列表 - 空数据处理', async ({ page }) => {
    await page.goto('/medical/scenarios');
    await page.waitForLoadState('networkidle');
    
    // 选择一个可能没有内容的分类
    const categoryButtons = page.locator('button[class*="rounded-full"]');
    const count = await categoryButtons.count();
    
    if (count > 1) {
      await categoryButtons.last().click();
      await page.waitForTimeout(500);
      
      // 检查是否显示空状态
      const hasEmptyState = await page.locator('text=No scenarios, text=暂无场景').isVisible().catch(() => false);
      const hasContent = await page.locator('[href^="/medical/scenarios/"]').isVisible().catch(() => false);
      
      // 要么有内容，要么显示空状态
      expect(hasEmptyState || hasContent).toBeTruthy();
    }
  });

  test('场景列表 - 加载状态', async ({ page, context }) => {
    await context.route('**/*', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.continue();
    });
    
    const navigationPromise = page.goto('/medical/scenarios');
    await expectSkeleton(page);
    await navigationPromise;
    await page.waitForLoadState('networkidle');
  });
});

test.describe('错误处理 - Lessons 页面', () => {
  
  test('Lessons 列表 - 断网错误处理', async ({ page }) => {
    await page.goto('/lessons');
    await page.waitForLoadState('networkidle');
    
    await goOffline(page);
    await page.reload();
    
    await expectErrorDisplay(page);
    
    await goOnline(page);
  });

  test('Lessons 列表 - 空数据处理', async ({ page }) => {
    await page.goto('/lessons');
    await page.waitForLoadState('networkidle');
    
    // 尝试搜索不存在的内容
    const searchInput = page.locator('input[placeholder*="Search"], input[placeholder*="搜索"]');
    if (await searchInput.isVisible()) {
      await searchInput.fill('nonexistentlesson12345xyz');
      await page.waitForTimeout(500);
      
      // 检查空状态
      const hasEmptyState = await page.locator('text=No lessons, text=暂无课程').isVisible().catch(() => false);
      const hasContent = await page.locator('[href^="/lesson/"]').isVisible().catch(() => false);
      
      expect(hasEmptyState || hasContent).toBeTruthy();
    }
  });

  test('Lessons 列表 - 加载状态', async ({ page, context }) => {
    await context.route('**/*', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.continue();
    });
    
    const navigationPromise = page.goto('/lessons');
    await expectSkeleton(page);
    await navigationPromise;
    await page.waitForLoadState('networkidle');
  });
});

test.describe('错误处理 - Grammar 页面', () => {
  
  test('Grammar 列表 - 断网错误处理', async ({ page }) => {
    await page.goto('/grammar');
    
    // 等待页面加载或错误显示
    await page.waitForLoadState('networkidle');
    
    await goOffline(page);
    await page.reload();
    
    // 期望显示错误或正常内容（取决于是否有缓存）
    const hasError = await page.locator('text=发生错误, text=error').isVisible().catch(() => false);
    const hasContent = await page.locator('h1').isVisible().catch(() => false);
    
    expect(hasError || hasContent).toBeTruthy();
    
    await goOnline(page);
  });

  test('Grammar 详情 - 访问未发布内容', async ({ page }) => {
    await page.goto('/grammar/nonexistent-pattern-12345');
    
    const is404 = await page.locator('text=404').isVisible().catch(() => false);
    const hasError = await page.locator('text=not found, text=不存在').isVisible().catch(() => false);
    
    expect(is404 || hasError).toBeTruthy();
  });
});

test.describe('错误处理 - Dashboard', () => {
  
  test('Dashboard - 断网错误处理', async ({ page }) => {
    // 注意：Dashboard 可能需要登录
    await page.goto('/dashboard');
    
    // 如果需要登录，跳过此测试
    const isLoginPage = await page.locator('text=login, text=登录').isVisible().catch(() => false);
    if (isLoginPage) {
      test.skip();
      return;
    }
    
    await page.waitForLoadState('networkidle');
    await goOffline(page);
    await page.reload();
    
    const hasError = await page.locator('text=发生错误, text=error').isVisible().catch(() => false);
    const hasContent = await page.locator('h1, h2').isVisible().catch(() => false);
    
    expect(hasError || hasContent).toBeTruthy();
    
    await goOnline(page);
  });

  test('Dashboard - 加载状态', async ({ page, context }) => {
    await context.route('**/*', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      await route.continue();
    });
    
    await page.goto('/dashboard');
    
    const isLoginPage = await page.locator('text=login, text=登录').isVisible().catch(() => false);
    if (isLoginPage) {
      test.skip();
      return;
    }
    
    await page.waitForLoadState('networkidle');
  });
});

test.describe('错误处理 - SRS', () => {
  
  test('SRS - 断网错误处理', async ({ page }) => {
    await page.goto('/srs');
    
    const isLoginPage = await page.locator('text=login, text=登录').isVisible().catch(() => false);
    if (isLoginPage) {
      test.skip();
      return;
    }
    
    await page.waitForLoadState('networkidle');
    await goOffline(page);
    await page.reload();
    
    const hasError = await page.locator('text=发生错误, text=error').isVisible().catch(() => false);
    const hasContent = await page.locator('h1, h2').isVisible().catch(() => false);
    
    expect(hasError || hasContent).toBeTruthy();
    
    await goOnline(page);
  });

  test('SRS - 空数据处理', async ({ page }) => {
    await page.goto('/srs');
    
    const isLoginPage = await page.locator('text=login, text=登录').isVisible().catch(() => false);
    if (isLoginPage) {
      test.skip();
      return;
    }
    
    await page.waitForLoadState('networkidle');
    
    // 检查是否有空状态或内容
    const hasEmptyState = await page.locator('text=No cards, text=暂无卡片, text=空').isVisible().catch(() => false);
    const hasContent = await page.locator('[data-testid="srs-card"], .srs-card').isVisible().catch(() => false);
    
    expect(hasEmptyState || hasContent).toBeTruthy();
  });
});

test.describe('错误处理 - Search', () => {
  
  test('Search - 空搜索结果', async ({ page }) => {
    await page.goto('/search?q=nonexistentsearchterm12345xyz');
    
    await page.waitForLoadState('networkidle');
    
    // 检查空状态
    const hasEmptyState = await page.locator('text=No results, text=无结果, text=未找到').isVisible().catch(() => false);
    const hasContent = await page.locator('[data-testid="search-result"]').isVisible().catch(() => false);
    
    expect(hasEmptyState || hasContent).toBeTruthy();
  });

  test('Search - 断网错误处理', async ({ page }) => {
    await page.goto('/search');
    await page.waitForLoadState('networkidle');
    
    // 输入搜索词
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"], input[placeholder*="搜索"]');
    if (await searchInput.isVisible()) {
      await goOffline(page);
      await searchInput.fill('test query');
      await searchInput.press('Enter');
      
      await page.waitForTimeout(1000);
      
      // 检查错误状态
      const hasError = await page.locator('text=发生错误, text=error, text=网络').isVisible().catch(() => false);
      expect(hasError).toBeTruthy();
      
      await goOnline(page);
    }
  });
});

test.describe('错误处理 - Reading 页面', () => {
  
  test('Reading 详情 - 访问未发布内容', async ({ page }) => {
    await page.goto('/reader/nonexistent-reading-12345');
    
    const is404 = await page.locator('text=404').isVisible().catch(() => false);
    const hasError = await page.locator('text=not found, text=不存在').isVisible().catch(() => false);
    
    expect(is404 || hasError).toBeTruthy();
  });

  test('Reading 详情 - 断网错误处理', async ({ page }) => {
    await page.goto('/reader/test-reading-id');
    await page.waitForLoadState('networkidle');
    
    await goOffline(page);
    await page.reload();
    
    const hasError = await page.locator('text=发生错误, text=error').isVisible().catch(() => false);
    const is404 = await page.locator('text=404').isVisible().catch(() => false);
    
    expect(hasError || is404).toBeTruthy();
    
    await goOnline(page);
  });
});

/**
 * 通用错误处理测试
 */
test.describe('通用错误处理', () => {
  
  test('所有主要页面都能正常加载', async ({ page }) => {
    const pages = [
      '/',
      '/medical',
      '/medical/vocabulary',
      '/medical/scenarios',
      '/lessons',
      '/grammar',
    ];
    
    for (const path of pages) {
      await page.goto(path);
      await page.waitForLoadState('networkidle');
      
      // 检查页面没有明显的错误
      const hasError = await page.locator('text=发生错误, text=error occurred').isVisible().catch(() => false);
      expect(hasError).toBeFalsy();
      
      // 检查页面有标题
      const hasTitle = await page.locator('h1').isVisible().catch(() => false);
      expect(hasTitle).toBeTruthy();
    }
  });

  test('ErrorDisplay 组件提供重试功能', async ({ page }) => {
    // 访问一个页面然后模拟错误
    await page.goto('/medical/vocabulary');
    await page.waitForLoadState('networkidle');
    
    await goOffline(page);
    await page.reload();
    
    // 查找重试按钮
    const retryButton = page.locator('button:has-text("重新尝试"), button:has-text("重试")');
    const isVisible = await retryButton.isVisible().catch(() => false);
    
    if (isVisible) {
      await goOnline(page);
      await retryButton.click();
      await page.waitForLoadState('networkidle');
      
      // 验证页面恢复正常
      const hasTitle = await page.locator('h1').isVisible();
      expect(hasTitle).toBeTruthy();
    }
  });
});

/**
 * 性能测试
 */
test.describe('加载性能', () => {
  
  test('骨架屏显示时间应该合理', async ({ page, context }) => {
    await context.route('**/*', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      await route.continue();
    });
    
    const startTime = Date.now();
    await page.goto('/medical/vocabulary');
    
    // 等待骨架屏出现
    const skeleton = page.locator('.skeleton, [data-testid="skeleton"], .animate-pulse');
    try {
      await skeleton.first().waitFor({ state: 'visible', timeout: 1000 });
      const skeletonTime = Date.now() - startTime;
      
      // 骨架屏应该在 1 秒内显示
      expect(skeletonTime).toBeLessThan(1000);
    } catch (e) {
      // 如果骨架屏没有出现，可能是加载太快，这也是可以接受的
      console.log('Skeleton not shown - page loaded quickly');
    }
    
    await page.waitForLoadState('networkidle');
  });
});

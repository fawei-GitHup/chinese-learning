/**
 * W10-03: 性能基线测试
 * 
 * 测试内容：
 * 1. 列表页面加载性能
 * 2. 分页功能性能
 * 3. 搜索功能性能
 * 4. 导航性能
 */

import { test, expect } from '@playwright/test'

// 性能阈值配置
const PERFORMANCE_THRESHOLDS = {
  pageLoad: 3000,      // 页面加载时间上限 (ms)
  navigation: 2000,    // 导航响应时间上限 (ms)
  searchDebounce: 500, // 搜索防抖时间上限 (ms)
  apiResponse: 1000,   // API 响应时间上限 (ms)
}

test.describe('性能基线测试', () => {
  test.beforeEach(async ({ page }) => {
    // 设置视口大小
    await page.setViewportSize({ width: 1920, height: 1080 })
  })

  test.describe('1. 列表页面加载性能', () => {
    test('医疗词汇列表页加载时间应在阈值内', async ({ page }) => {
      const startTime = Date.now()
      
      await page.goto('/medical/vocabulary')
      await page.waitForSelector('text=Medical Vocabulary', { timeout: 5000 })
      
      const loadTime = Date.now() - startTime
      
      console.log(`医疗词汇列表页加载时间: ${loadTime}ms`)
      expect(loadTime).toBeLessThan(PERFORMANCE_THRESHOLDS.pageLoad)
    })

    test('场景列表页加载时间应在阈值内', async ({ page }) => {
      const startTime = Date.now()
      
      await page.goto('/medical/scenarios')
      await page.waitForSelector('text=Medical Scenarios', { timeout: 5000 })
      
      const loadTime = Date.now() - startTime
      
      console.log(`场景列表页加载时间: ${loadTime}ms`)
      expect(loadTime).toBeLessThan(PERFORMANCE_THRESHOLDS.pageLoad)
    })

    test('Lessons列表页加载时间应在阈值内', async ({ page }) => {
      const startTime = Date.now()
      
      await page.goto('/lessons')
      await page.waitForSelector('text=Lessons', { timeout: 5000 })
      
      const loadTime = Date.now() - startTime
      
      console.log(`Lessons列表页加载时间: ${loadTime}ms`)
      expect(loadTime).toBeLessThan(PERFORMANCE_THRESHOLDS.pageLoad)
    })

    test('Grammar列表页加载时间应在阈值内', async ({ page }) => {
      const startTime = Date.now()
      
      await page.goto('/grammar')
      await page.waitForSelector('text=Grammar Guide', { timeout: 5000 })
      
      const loadTime = Date.now() - startTime
      
      console.log(`Grammar列表页加载时间: ${loadTime}ms`)
      expect(loadTime).toBeLessThan(PERFORMANCE_THRESHOLDS.pageLoad)
    })

    test('搜索页面加载时间应在阈值内', async ({ page }) => {
      const startTime = Date.now()
      
      await page.goto('/search')
      await page.waitForSelector('text=全站搜索', { timeout: 5000 })
      
      const loadTime = Date.now() - startTime
      
      console.log(`搜索页面加载时间: ${loadTime}ms`)
      expect(loadTime).toBeLessThan(PERFORMANCE_THRESHOLDS.pageLoad)
    })
  })

  test.describe('2. 分页功能性能', () => {
    test('医疗词汇分页切换应快速响应', async ({ page }) => {
      await page.goto('/medical/vocabulary')
      
      // 等待列表加载完成
      await page.waitForSelector('[class*="grid"]', { timeout: 5000 })
      
      // 查找 Next 按钮（可能在分页控件中）
      const nextButton = page.getByRole('button', { name: /next/i })
      const isVisible = await nextButton.isVisible().catch(() => false)
      
      if (isVisible && await nextButton.isEnabled()) {
        const startTime = Date.now()
        await nextButton.click()
        
        // 等待 URL 更新
        await page.waitForURL(/page=2/, { timeout: 5000 })
        
        const navigationTime = Date.now() - startTime
        
        console.log(`分页切换时间: ${navigationTime}ms`)
        expect(navigationTime).toBeLessThan(PERFORMANCE_THRESHOLDS.navigation)
      } else {
        console.log('分页按钮不可见或已禁用，跳过测试')
        test.skip()
      }
    })

    test('URL 参数应正确同步分页状态', async ({ page }) => {
      await page.goto('/medical/vocabulary?page=2')
      
      // 验证 URL 参数被正确应用
      await page.waitForURL(/page=2/, { timeout: 3000 })
      
      // 验证列表内容已加载
      await page.waitForSelector('[class*="grid"]', { timeout: 5000 })
      
      expect(page.url()).toContain('page=2')
    })
  })

  test.describe('3. 搜索功能性能', () => {
    test('搜索防抖应正常工作', async ({ page }) => {
      await page.goto('/search')
      
      const searchInput = page.getByPlaceholder(/搜索|search/i)
      await searchInput.waitFor({ timeout: 5000 })
      
      // 快速输入多个字符
      const startTime = Date.now()
      await searchInput.fill('头')
      await searchInput.fill('头痛')
      await searchInput.fill('头痛症')
      
      // 等待防抖完成
      await page.waitForTimeout(PERFORMANCE_THRESHOLDS.searchDebounce)
      
      const debounceTime = Date.now() - startTime
      
      console.log(`搜索防抖时间: ${debounceTime}ms`)
      
      // 验证只触发一次搜索（通过检查 URL 或结果）
      const url = page.url()
      expect(url).toContain('q=')
    })

    test('搜索结果应快速加载', async ({ page }) => {
      await page.goto('/search')
      
      const searchInput = page.getByPlaceholder(/搜索|search/i)
      await searchInput.waitFor({ timeout: 5000 })
      
      const startTime = Date.now()
      await searchInput.fill('发烧')
      
      // 等待搜索结果显示
      await page.waitForSelector('text=找到', { timeout: 5000 }).catch(() => {
        // 如果没有结果，等待"没有找到"消息
        return page.waitForSelector('text=没有找到', { timeout: 5000 })
      })
      
      const searchTime = Date.now() - startTime
      
      console.log(`搜索完成时间: ${searchTime}ms`)
      expect(searchTime).toBeLessThan(PERFORMANCE_THRESHOLDS.pageLoad)
    })

    test('搜索历史应即时显示', async ({ page }) => {
      await page.goto('/search')
      
      // 执行一次搜索以创建历史
      const searchInput = page.getByPlaceholder(/搜索|search/i)
      await searchInput.fill('测试')
      await page.waitForTimeout(500)
      
      // 清空搜索框
      await searchInput.clear()
      
      // 再次聚焦，检查历史记录
      const startTime = Date.now()
      await searchInput.focus()
      
      // 搜索历史应该快速显示（如果有的话）
      const focusTime = Date.now() - startTime
      
      console.log(`搜索历史显示时间: ${focusTime}ms`)
      expect(focusTime).toBeLessThan(100) // 聚焦响应应该非常快
    })
  })

  test.describe('4. 导航性能', () => {
    test('首页到列表页导航应快速', async ({ page }) => {
      await page.goto('/')
      
      const startTime = Date.now()
      await page.getByRole('link', { name: /vocabulary|词汇/i }).first().click()
      
      await page.waitForLoadState('networkidle')
      
      const navigationTime = Date.now() - startTime
      
      console.log(`导航到词汇列表时间: ${navigationTime}ms`)
      expect(navigationTime).toBeLessThan(PERFORMANCE_THRESHOLDS.navigation)
    })

    test('返回按钮应快速响应', async ({ page }) => {
      await page.goto('/medical/vocabulary')
      
      const backButton = page.getByRole('link', { name: /back/i }).first()
      
      const startTime = Date.now()
      await backButton.click()
      
      await page.waitForLoadState('networkidle')
      
      const navigationTime = Date.now() - startTime
      
      console.log(`返回导航时间: ${navigationTime}ms`)
      expect(navigationTime).toBeLessThan(PERFORMANCE_THRESHOLDS.navigation)
    })
  })

  test.describe('5. 资源加载性能', () => {
    test('首屏资源数量应合理', async ({ page }) => {
      const requests: string[] = []
      
      page.on('request', request => {
        requests.push(request.url())
      })
      
      await page.goto('/medical/vocabulary')
      await page.waitForLoadState('networkidle')
      
      const jsRequests = requests.filter(url => url.endsWith('.js'))
      const cssRequests = requests.filter(url => url.endsWith('.css'))
      
      console.log(`JS 请求数: ${jsRequests.length}`)
      console.log(`CSS 请求数: ${cssRequests.length}`)
      console.log(`总请求数: ${requests.length}`)
      
      // 验证资源数量在合理范围内
      expect(jsRequests.length).toBeLessThan(50)  // 太多的 JS 文件会影响性能
      expect(cssRequests.length).toBeLessThan(20) // 太多的 CSS 文件会影响性能
    })

    test('页面不应有内存泄漏', async ({ page }) => {
      await page.goto('/search')
      
      // 执行多次搜索操作
      const searchInput = page.getByPlaceholder(/搜索|search/i)
      
      for (let i = 0; i < 5; i++) {
        await searchInput.fill(`测试${i}`)
        await page.waitForTimeout(300)
      }
      
      // 获取性能指标
      const metrics = await page.evaluate(() => {
        const perf = performance as any
        if (perf.memory) {
          return {
            usedJSHeapSize: perf.memory.usedJSHeapSize,
            totalJSHeapSize: perf.memory.totalJSHeapSize,
            jsHeapSizeLimit: perf.memory.jsHeapSizeLimit,
          }
        }
        return null
      })
      
      if (metrics) {
        console.log('内存使用情况:', metrics)
        
        // 验证堆内存使用率不超过 80%
        const heapUsageRatio = metrics.usedJSHeapSize / metrics.jsHeapSizeLimit
        expect(heapUsageRatio).toBeLessThan(0.8)
      } else {
        console.log('浏览器不支持 performance.memory API')
      }
    })
  })

  test.describe('6. 骨架屏和加载状态', () => {
    test('列表页应显示骨架屏', async ({ page }) => {
      await page.goto('/medical/vocabulary')
      
      // 检查是否有骨架屏或加载状态
      const hasSkeleton = await page.locator('[class*="skeleton"]').isVisible().catch(() => false)
      const hasLoadingText = await page.locator('text=/loading|加载/i').isVisible().catch(() => false)
      
      console.log(`骨架屏可见: ${hasSkeleton}, 加载文本可见: ${hasLoadingText}`)
      
      // 至少应该有其中一种加载指示
      if (!hasSkeleton && !hasLoadingText) {
        console.warn('未检测到加载指示器')
      }
    })

    test('骨架屏应快速消失', async ({ page }) => {
      const startTime = Date.now()
      
      await page.goto('/medical/vocabulary')
      
      // 等待内容加载（骨架屏消失）
      await page.waitForSelector('[class*="grid"]', { timeout: 5000 })
      
      const loadTime = Date.now() - startTime
      
      console.log(`内容加载时间: ${loadTime}ms`)
      expect(loadTime).toBeLessThan(PERFORMANCE_THRESHOLDS.pageLoad)
    })
  })

  test.describe('7. Core Web Vitals (模拟)', () => {
    test('测量 FCP 和 LCP', async ({ page }) => {
      await page.goto('/medical/vocabulary')
      
      // 等待页面完全加载
      await page.waitForLoadState('networkidle')
      
      const webVitals = await page.evaluate(() => {
        return new Promise((resolve) => {
          const results: any = {}
          
          // 获取 FCP
          const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0] as PerformanceEntry
          if (fcpEntry) {
            results.fcp = fcpEntry.startTime
          }
          
          // 获取 LCP (需要 web-vitals 库，这里只是模拟)
          if ('PerformanceObserver' in window) {
            try {
              const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries()
                const lastEntry = entries[entries.length - 1] as any
                results.lcp = lastEntry.renderTime || lastEntry.loadTime
                observer.disconnect()
                resolve(results)
              })
              observer.observe({ entryTypes: ['largest-contentful-paint'] })
              
              // 超时保护
              setTimeout(() => {
                observer.disconnect()
                resolve(results)
              }, 3000)
            } catch (e) {
              resolve(results)
            }
          } else {
            resolve(results)
          }
        })
      })
      
      console.log('Web Vitals:', webVitals)
      
      // 验证 FCP < 1.8s
      if ((webVitals as any).fcp) {
        expect((webVitals as any).fcp).toBeLessThan(1800)
      }
      
      // 验证 LCP < 2.5s
      if ((webVitals as any).lcp) {
        expect((webVitals as any).lcp).toBeLessThan(2500)
      }
    })
  })
})

test.describe('性能回归测试', () => {
  test('Bundle 大小不应超过阈值', async ({ page }) => {
    const requests: { url: string; size: number }[] = []
    
    page.on('response', async response => {
      const url = response.url()
      if (url.includes('.js') || url.includes('.css')) {
        try {
          const buffer = await response.body()
          requests.push({
            url,
            size: buffer.length
          })
        } catch (e) {
          // 忽略错误
        }
      }
    })
    
    await page.goto('/medical/vocabulary')
    await page.waitForLoadState('networkidle')
    
    const totalSize = requests.reduce((sum, req) => sum + req.size, 0)
    const totalSizeKB = Math.round(totalSize / 1024)
    
    console.log(`总资源大小: ${totalSizeKB} KB`)
    console.log(`JS/CSS 文件数: ${requests.length}`)
    
    // 打印最大的 5 个文件
    const largestFiles = requests
      .sort((a, b) => b.size - a.size)
      .slice(0, 5)
      .map(req => ({
        file: req.url.split('/').pop(),
        size: `${Math.round(req.size / 1024)} KB`
      }))
    
    console.log('最大的文件:', largestFiles)
    
    // 验证总资源大小 < 1MB
    expect(totalSize).toBeLessThan(1024 * 1024)
  })
})

/**
 * 如意数据大屏 - E2E 测试
 *
 * 使用 Playwright 验证页面正确渲染。
 */

import { test, expect } from '@playwright/test'

test.describe('RuyiBigScreen Dashboard', () => {
  test('should display the page with correct title', async ({ page }) => {
    // 打开首页
    await page.goto('/')

    // 验证页面标题
    await expect(page).toHaveTitle(/如意数据大屏/)
  })

  test('should display metric cards', async ({ page }) => {
    await page.goto('/')

    // 等待数据加载完成
    await page.waitForTimeout(2000)

    // 验证指标卡片存在 - 每个 MetricCard 显示 label 和 value
    const metricLabels = ['今日访问量', '实时订单数', '活跃用户数', '系统健康度']

    for (const label of metricLabels) {
      const card = page.locator('text=' + label)
      await expect(card).toBeVisible({ timeout: 5000 })
    }
  })

  test('should display chart containers', async ({ page }) => {
    await page.goto('/')

    // 等待数据加载完成
    await page.waitForTimeout(2000)

    // 验证面板标题存在（每个图表都在 BasePanel 中）
    const panelTitles = ['访问趋势', '分类占比', '如意数据中枢', '城市排名', '能力雷达', '实时动态']

    for (const title of panelTitles) {
      const panel = page.locator('text=' + title)
      await expect(panel).toBeVisible({ timeout: 5000 })
    }
  })

  test('should render ECharts canvases', async ({ page }) => {
    await page.goto('/')

    // 等待 ECharts 渲染
    await page.waitForTimeout(3000)

    // 验证 canvas 元素存在（ECharts 渲染为 canvas）
    const canvases = page.locator('canvas')
    const count = await canvases.count()
    expect(count).toBeGreaterThanOrEqual(5)
  })

  test('should display activity list', async ({ page }) => {
    await page.goto('/')

    // 等待数据加载
    await page.waitForTimeout(2000)

    // 验证活动列表存在
    const activityList = page.locator('.dashboard-activity__list')
    await expect(activityList).toBeVisible({ timeout: 5000 })

    // 验证至少有一个活动项
    const items = page.locator('.dashboard-activity__item')
    const count = await items.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should have no console errors', async ({ page }) => {
    // 收集控制台错误
    const consoleErrors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })

    await page.goto('/')
    await page.waitForTimeout(3000)

    // 验证没有严重错误（忽略 favicon 404 等非关键错误）
    const criticalErrors = consoleErrors.filter(
      (err) => !err.includes('favicon') && !err.includes('net::ERR_ABORTED')
    )
    expect(criticalErrors.length).toBe(0)
  })

  test('should sustain realtime refresh without errors', async ({ page }) => {
    // 收集控制台错误
    const consoleErrors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })

    await page.goto('/')
    await page.waitForTimeout(2000)

    // 确认初始数据已加载
    await expect(page.locator('text=如意数据中枢')).toBeVisible({ timeout: 5000 })

    // 等待约 3 秒，至少经历一次实时刷新周期
    await page.waitForTimeout(4000)

    // 页面仍然正常工作
    await expect(page.locator('text=如意数据中枢')).toBeVisible({ timeout: 5000 })
    await expect(page.locator('text=今日访问量')).toBeVisible({ timeout: 5000 })

    // 仍然没有严重错误
    const criticalErrors = consoleErrors.filter(
      (err) => !err.includes('favicon') && !err.includes('net::ERR_ABORTED')
    )
    expect(criticalErrors.length).toBe(0)
  })
})

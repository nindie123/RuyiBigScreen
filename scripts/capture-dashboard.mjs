/**
 * 如意数据大屏 - 自动化截图脚本
 *
 * 使用 Playwright 打开大屏页面，等待渲染完成后截取 1920x1080 全屏图。
 * 截图保存到 docs/screenshots/dashboard-1920x1080.png
 *
 * 使用方法：
 *   1. 先启动开发服务： npm run dev -- --host 127.0.0.1 --port 10001
 *   2. 再执行截图：    npm run screenshot
 *
 * 环境要求：
 *   - 开发服务已在 http://127.0.0.1:10001/ 运行
 *   - Playwright 浏览器已安装 (npx playwright install chromium)
 */

import { chromium } from '@playwright/test'
import { mkdirSync, existsSync, statSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

// ── 配置 ──────────────────────────────────────
const BASE_URL = 'http://127.0.0.1:10001/'
const VIEWPORT = { width: 1920, height: 1080 }
const OUTPUT_PATH = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../docs/screenshots/dashboard-1920x1080.png'
)
// ──────────────────────────────────────────────

async function capture() {
  let browser
  const errors = []

  try {
    // 1. 确保输出目录存在
    const outDir = dirname(OUTPUT_PATH)
    if (!existsSync(outDir)) {
      mkdirSync(outDir, { recursive: true })
      console.log(`[Screenshot] 已创建目录: ${outDir}`)
    }

    // 2. 启动浏览器
    browser = await chromium.launch({ headless: true })
    const context = await browser.newContext({ viewport: VIEWPORT })
    const page = await context.newPage()

    // 3. 收集 console error
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(`[${msg.type()}] ${msg.text()}`)
      }
    })

    // 4. 访问页面
    console.log(`[Screenshot] 正在打开: ${BASE_URL}`)
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 })

    // 5. 等待页面标题出现
    await page.waitForSelector('h1', { timeout: 15000 })
    const title = await page.title()
    console.log(`[Screenshot] 页面标题: ${title}`)

    // 6. 等待核心内容出现：指标卡片 + 中枢标题 + canvas
    await page.waitForSelector('.metric-card', { timeout: 15000 })
    console.log('[Screenshot] 指标卡片已加载')

    await page.waitForSelector('text=如意数据中枢', { timeout: 15000 })
    console.log('[Screenshot] 如意数据中枢已加载')

    await page.waitForSelector('canvas', { timeout: 15000 })
    console.log('[Screenshot] ECharts 图表容器已加载')

    // 7. 等待实时数据刷新至少一轮（模拟器 2s 一帧，等 5s 确保数据和动态消息刷新）
    console.log('[Screenshot] 等待实时数据刷新...')
    await page.waitForTimeout(5000)

    // 8. 控制台错误报告
    if (errors.length > 0) {
      console.log(`\n[Screenshot] ⚠️  检测到 ${errors.length} 个控制台错误:`)
      errors.forEach((err) => console.log(`  ${err}`))
    }

    // 9. 截图
    console.log(`\n[Screenshot] 正在截图...`)
    await page.screenshot({
      path: OUTPUT_PATH,
      fullPage: false,
    })

    // 10. 验证截图文件
    const stats = statSync(OUTPUT_PATH)
    console.log(`[Screenshot] 截图已保存: ${OUTPUT_PATH}`)
    console.log(`[Screenshot] 文件大小: ${(stats.size / 1024).toFixed(1)} KB`)
    console.log(`[Screenshot] 截图尺寸: ${VIEWPORT.width}x${VIEWPORT.height}`)

    // 11. 关闭浏览器
    await browser.close()

    // 12. 如果有 console error，以非 0 退出
    if (errors.length > 0) {
      console.error(`\n[Screenshot] ❌ 存在 ${errors.length} 个控制台错误，命令失败`)
      process.exit(1)
    }

    console.log(`\n[Screenshot] ✅ 截图完成，无控制台错误`)
    process.exit(0)
  } catch (err) {
    console.error('\n[Screenshot] ❌ 截图过程出错:', err instanceof Error ? err.message : err)

    // 错误时也尝试保存截图
    if (browser) {
      try {
        const pages = browser.contexts()[0]?.pages()
        if (pages?.length) {
          const errorPath = OUTPUT_PATH.replace('.png', '-error.png')
          await pages[0].screenshot({ path: errorPath, fullPage: false })
          console.log(`[Screenshot] 错误状态截图已保存: ${errorPath}`)
        }
      } catch {
        // 忽略截图失败
      }
      await browser.close()
    }

    process.exit(1)
  }
}

capture()

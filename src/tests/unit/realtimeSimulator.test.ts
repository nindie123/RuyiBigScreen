/**
 * 如意数据大屏 - 实时数据模拟器单元测试
 *
 * 验证实时模拟器各项约束。
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { nextFrame, resetSimulator, getFrameCount } from '../../mocks/realtimeDashboardSimulator'

describe('RealtimeDashboardSimulator', () => {
  beforeEach(() => {
    resetSimulator()
  })

  it('should return valid DashboardData on first call', () => {
    const data = nextFrame()
    expect(data).toBeDefined()
    expect(data).toHaveProperty('summary')
    expect(data).toHaveProperty('trend')
    expect(data).toHaveProperty('categories')
    expect(data).toHaveProperty('ranking')
    expect(data).toHaveProperty('radar')
    expect(data).toHaveProperty('activities')
    expect(data).toHaveProperty('hubNodes')
  })

  it('should increment frame counter on each call', () => {
    expect(getFrameCount()).toBe(0)
    nextFrame()
    expect(getFrameCount()).toBe(1)
    nextFrame()
    expect(getFrameCount()).toBe(2)
  })

  it('should update summary metrics each frame', () => {
    const frame1 = nextFrame()
    const frame2 = nextFrame()

    // todayVisits should increase (only increments)
    expect(frame2.summary.todayVisits).toBeGreaterThanOrEqual(frame1.summary.todayVisits)

    // systemHealth should stay within expected range
    expect(frame2.summary.systemHealth).toBeGreaterThanOrEqual(95)
    expect(frame2.summary.systemHealth).toBeLessThanOrEqual(99.9)
  })

  it('trend array length should stay within TREND_WINDOW', () => {
    // Call many times to trigger trend window updates (every 3 frames)
    for (let i = 0; i < 50; i++) {
      const data = nextFrame()
      expect(data.trend.length).toBeLessThanOrEqual(10)
    }
    const final = nextFrame()
    expect(final.trend.length).toBeLessThanOrEqual(10)
  })

  it('activities array should not grow beyond max', () => {
    // Call many times to trigger activity creation
    for (let i = 0; i < 100; i++) {
      const data = nextFrame()
      // Activities are capped at 8
      expect(data.activities.length).toBeLessThanOrEqual(8)
    }
  })

  it('categories should sum to 100', () => {
    for (let i = 0; i < 20; i++) {
      const data = nextFrame()
      const sum = data.categories.reduce((s, c) => s + c.value, 0)
      expect(sum).toBe(100)
    }
  })

  it('hubNodes values should stay within valid range [40, 100]', () => {
    for (let i = 0; i < 30; i++) {
      const data = nextFrame()
      for (const node of data.hubNodes) {
        expect(node.value).toBeGreaterThanOrEqual(40)
        expect(node.value).toBeLessThanOrEqual(100)
      }
    }
  })

  it('hubNodes status should align with value thresholds', () => {
    for (let i = 0; i < 30; i++) {
      const data = nextFrame()
      for (const node of data.hubNodes) {
        if (node.id === 'center') continue
        if (node.value >= 70) expect(node.status).toBe('good')
        else if (node.value >= 55) {
          expect(['warning', 'good']).toContain(node.status)
        } else {
          expect(node.status).toBe('danger')
        }
      }
    }
  })

  it('ranking items should have valid structure', () => {
    const data = nextFrame()
    for (const item of data.ranking) {
      expect(item.rank).toBeGreaterThanOrEqual(1)
      expect(item.value).toBeGreaterThan(0)
      expect(['up', 'down', 'stable']).toContain(item.change)
    }
  })
})

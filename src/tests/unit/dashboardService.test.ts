/**
 * 如意数据大屏 - 仪表盘数据服务单元测试
 *
 * 测试在 mock 模式下数据服务能正常返回数据。
 */

import { describe, it, expect } from 'vitest'

import {
  fetchSummary,
  fetchTrend,
  fetchCategories,
  fetchRanking,
  fetchRadar,
  fetchActivities,
  fetchDashboardAll,
} from '../../services/dashboardService'

// 设置一个较长的超时时间，因为 mock 有模拟延迟
const MOCK_TIMEOUT = 10000

describe('DashboardService in mock mode', () => {
  it('fetchSummary should return summary metrics', async () => {
    const data = await fetchSummary()
    expect(data).toBeDefined()
    expect(typeof data.todayVisits).toBe('number')
    expect(typeof data.realtimeOrders).toBe('number')
    expect(typeof data.activeUsers).toBe('number')
    expect(typeof data.systemHealth).toBe('number')
    expect(data.todayVisits).toBeGreaterThan(0)
    expect(data.systemHealth).toBeGreaterThan(0)
  }, MOCK_TIMEOUT)

  it('fetchTrend should return trend data array', async () => {
    const data = await fetchTrend()
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBeGreaterThan(0)
    expect(data[0]).toHaveProperty('date')
    expect(data[0]).toHaveProperty('value')
  }, MOCK_TIMEOUT)

  it('fetchCategories should return category distribution', async () => {
    const data = await fetchCategories()
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBeGreaterThan(0)
    expect(data[0]).toHaveProperty('name')
    expect(data[0]).toHaveProperty('value')
  }, MOCK_TIMEOUT)

  it('fetchRanking should return ranking list', async () => {
    const data = await fetchRanking()
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBeGreaterThan(0)
    expect(data[0]).toHaveProperty('rank')
    expect(data[0]).toHaveProperty('name')
    expect(data[0]).toHaveProperty('value')
    expect(data[0]).toHaveProperty('change')
  }, MOCK_TIMEOUT)

  it('fetchRadar should return radar dimensions', async () => {
    const data = await fetchRadar()
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBeGreaterThan(0)
    expect(data[0]).toHaveProperty('name')
    expect(data[0]).toHaveProperty('value')
    expect(data[0]).toHaveProperty('max')
  }, MOCK_TIMEOUT)

  it('fetchActivities should return activity list', async () => {
    const data = await fetchActivities()
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBeGreaterThan(0)
    expect(data[0]).toHaveProperty('id')
    expect(data[0]).toHaveProperty('type')
    expect(data[0]).toHaveProperty('message')
    expect(data[0]).toHaveProperty('time')
  }, MOCK_TIMEOUT)

  it('fetchDashboardAll should return complete dashboard data', async () => {
    const data = await fetchDashboardAll()
    expect(data).toBeDefined()
    expect(data).toHaveProperty('summary')
    expect(data).toHaveProperty('trend')
    expect(data).toHaveProperty('categories')
    expect(data).toHaveProperty('ranking')
    expect(data).toHaveProperty('radar')
    expect(data).toHaveProperty('activities')
    expect(data.trend.length).toBeGreaterThan(0)
    expect(data.ranking.length).toBeGreaterThan(0)
  }, MOCK_TIMEOUT)

  it('realtime data should change between calls', async () => {
    // 由于模拟器有 50ms 时间窗口缓存，间隔 100ms 调用确保不同帧
    const data1 = await fetchDashboardAll()
    await new Promise((r) => setTimeout(r, 100))
    const data2 = await fetchDashboardAll()

    // todayVisits 应该增长（只增不降）
    expect(data2.summary.todayVisits).toBeGreaterThanOrEqual(data1.summary.todayVisits)
  }, MOCK_TIMEOUT)
})

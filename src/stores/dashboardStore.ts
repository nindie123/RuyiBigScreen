/**
 * 如意数据大屏 - 仪表盘数据 Store
 *
 * 管理所有仪表盘状态，通过 services 层获取数据。
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'
import type {
  SummaryMetrics,
  TrendDataPoint,
  CategoryItem,
  RankingItem,
  RadarDimension,
  ActivityItem,
} from '../types/dashboard'
import {
  fetchSummary,
  fetchTrend,
  fetchCategories,
  fetchRanking,
  fetchRadar,
  fetchActivities,
} from '../services/dashboardService'
import { logger } from '../logs/logger'

export const useDashboardStore = defineStore('dashboard', () => {
  /** 加载状态 */
  const loading = ref(false)
  const error = ref<string | null>(null)

  /** 核心指标 */
  const summary = ref<SummaryMetrics>({
    todayVisits: 0,
    realtimeOrders: 0,
    activeUsers: 0,
    systemHealth: 0,
  })

  /** 趋势数据 */
  const trend = ref<TrendDataPoint[]>([])

  /** 分类分布 */
  const categories = ref<CategoryItem[]>([])

  /** 排名数据 */
  const ranking = ref<RankingItem[]>([])

  /** 雷达数据 */
  const radar = ref<RadarDimension[]>([])

  /** 动态活动列表 */
  const activities = ref<ActivityItem[]>([])

  /** 刷新时间 */
  const lastUpdated = ref<string>('')

  /**
   * 加载所有仪表盘数据
   */
  async function loadAllData(): Promise<void> {
    loading.value = true
    error.value = null

    try {
      logger.info('[DashboardStore] 开始加载所有数据')

      // 并行请求所有数据
      const results = await Promise.allSettled([
        fetchSummary(),
        fetchTrend(),
        fetchCategories(),
        fetchRanking(),
        fetchRadar(),
        fetchActivities(),
      ])

      // 分别处理每个请求的结果
      if (results[0].status === 'fulfilled') summary.value = results[0].value
      else logger.error('[DashboardStore] 获取摘要失败', results[0].reason)

      if (results[1].status === 'fulfilled') trend.value = results[1].value
      else logger.error('[DashboardStore] 获取趋势失败', results[1].reason)

      if (results[2].status === 'fulfilled') categories.value = results[2].value
      else logger.error('[DashboardStore] 获取分类失败', results[2].reason)

      if (results[3].status === 'fulfilled') ranking.value = results[3].value
      else logger.error('[DashboardStore] 获取排名失败', results[3].reason)

      if (results[4].status === 'fulfilled') radar.value = results[4].value
      else logger.error('[DashboardStore] 获取雷达失败', results[4].reason)

      if (results[5].status === 'fulfilled') activities.value = results[5].value
      else logger.error('[DashboardStore] 获取活动失败', results[5].reason)

      lastUpdated.value = new Date().toLocaleString('zh-CN')
      logger.info('[DashboardStore] 所有数据加载完成')
    } catch (err) {
      const msg = err instanceof Error ? err.message : '未知错误'
      error.value = msg
      logger.error('[DashboardStore] 数据加载失败', { message: msg })
    } finally {
      loading.value = false
    }
  }

  /**
   * 重新加载所有数据
   */
  async function refresh(): Promise<void> {
    logger.info('[DashboardStore] 手动刷新数据')
    await loadAllData()
  }

  return {
    loading,
    error,
    summary,
    trend,
    categories,
    ranking,
    radar,
    activities,
    lastUpdated,
    loadAllData,
    refresh,
  }
})

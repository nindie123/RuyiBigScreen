/**
 * 如意数据大屏 - 仪表盘数据 Store
 *
 * 管理所有仪表盘状态，通过 services 层获取数据。
 * 支持实时刷新控制：startRealtime / stopRealtime
 */

import { defineStore } from 'pinia'
import { ref, shallowRef } from 'vue'
import type {
  SummaryMetrics,
  TrendDataPoint,
  CategoryItem,
  RankingItem,
  RadarDimension,
  ActivityItem,
  HubNode,
} from '../types/dashboard'
import {
  fetchSummary,
  fetchTrend,
  fetchCategories,
  fetchRanking,
  fetchRadar,
  fetchActivities,
  fetchHubNodes,
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

  /** 数据中枢节点 */
  const hubNodes = ref<HubNode[]>([])

  /** 刷新时间 */
  const lastUpdated = ref<string>('')

  /** 实时刷新状态 */
  const isRealtime = ref(false)

  /** 定时器 ID（shallowRef 避免深层响应） */
  const refreshTimer = shallowRef<ReturnType<typeof setInterval> | null>(null)

  /**
   * 加载所有仪表盘数据
   */
  async function loadAllData(): Promise<void> {
    loading.value = true
    error.value = null

    try {
      // 并行请求所有数据（实时模拟器中 nextFrame 按时间窗口缓存）
      const results = await Promise.allSettled([
        fetchSummary(),
        fetchTrend(),
        fetchCategories(),
        fetchRanking(),
        fetchRadar(),
        fetchActivities(),
        fetchHubNodes(),
      ])

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

      if (results[6].status === 'fulfilled') hubNodes.value = results[6].value
      else logger.error('[DashboardStore] 获取中枢节点失败', results[6].reason)

      lastUpdated.value = new Date().toLocaleString('zh-CN')
    } catch (err) {
      const msg = err instanceof Error ? err.message : '未知错误'
      error.value = msg
      logger.error('[DashboardStore] 数据加载失败', { message: msg })
    } finally {
      loading.value = false
    }
  }

  /**
   * 启动实时刷新（每 2 秒自动拉取新数据）
   */
  function startRealtime(): void {
    if (refreshTimer.value) return // 避免重复启动
    isRealtime.value = true
    logger.info('[DashboardStore] 实时刷新已启动 (6s 间隔)')
    refreshTimer.value = setInterval(() => {
      loadAllData()
    }, 6000)
  }

  /**
   * 停止实时刷新
   */
  function stopRealtime(): void {
    if (refreshTimer.value) {
      clearInterval(refreshTimer.value)
      refreshTimer.value = null
    }
    isRealtime.value = false
    logger.info('[DashboardStore] 实时刷新已停止')
  }

  /**
   * 手动刷新（保留，不会影响实时模式状态）
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
    hubNodes,
    lastUpdated,
    isRealtime,
    loadAllData,
    refresh,
    startRealtime,
    stopRealtime,
  }
})

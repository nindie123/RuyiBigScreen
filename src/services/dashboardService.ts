/**
 * 如意数据大屏 - 仪表盘数据服务
 *
 * 提供获取仪表盘数据的统一接口。
 * 内部根据数据源配置决定使用 mock 还是真实 API。
 *
 * 组件严禁直接读取 mock 文件或直接调用 axios，
 * 必须通过此服务层获取数据。
 */

import type {
  SummaryMetrics,
  TrendDataPoint,
  CategoryItem,
  RankingItem,
  RadarDimension,
  ActivityItem,
  HubNode,
  DashboardData,
  ApiResponse,
} from '../types/dashboard'
import httpClient from './http'
import { isMock, getApiBaseUrl } from './dataSource'
import { logger } from '../logs/logger'
import { getMockDashboardData } from '../mocks/dashboardMock'
import { nextFrame } from '../mocks/realtimeDashboardSimulator'

/** API 路径前缀 */
const API_PATH = '/dashboard'

/**
 * 实时数据快照缓存。
 * 在同一时间窗口（50ms）内多次调用返回同一帧数据，
 * 确保 Promise.allSettled 并发请求获取一致的数据快照。
 */
let cachedSnapshot: DashboardData | null = null
let lastSnapshotTime = 0

function getRealtimeSnapshot(): DashboardData {
  const now = Date.now()
  if (!cachedSnapshot || now - lastSnapshotTime > 50) {
    cachedSnapshot = nextFrame()
    lastSnapshotTime = now
  }
  return cachedSnapshot
}

/**
 * 通用请求包装
 * 根据数据源类型决定使用 mock 还是真实请求
 */
async function fetchData<T>(
  endpoint: string,
  mockData: T,
  _timeout = 500
): Promise<ApiResponse<T>> {
  if (isMock) {
    // Mock 模式：模拟网络延迟
    logger.debug(`[DashboardService] Mock ${endpoint}`)
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 300 + 100))
    return {
      code: 200,
      message: 'success',
      data: mockData,
      timestamp: Date.now(),
    }
  }

  // API 模式：真实 HTTP 请求
  logger.debug(`[DashboardService] API ${endpoint}`)
  const response = await httpClient.get<ApiResponse<T>>(`${getApiBaseUrl()}${endpoint}`)
  return response as unknown as ApiResponse<T>
}

/** 获取核心指标 */
export async function fetchSummary(): Promise<SummaryMetrics> {
  const mock = isMock ? getRealtimeSnapshot().summary : getMockDashboardData().summary
  const res = await fetchData(`${API_PATH}/summary`, mock)
  return res.data
}

/** 获取趋势数据 */
export async function fetchTrend(): Promise<TrendDataPoint[]> {
  const mock = isMock ? getRealtimeSnapshot().trend : getMockDashboardData().trend
  const res = await fetchData(`${API_PATH}/trend`, mock)
  return res.data
}

/** 获取分类分布 */
export async function fetchCategories(): Promise<CategoryItem[]> {
  const mock = isMock ? getRealtimeSnapshot().categories : getMockDashboardData().categories
  const res = await fetchData(`${API_PATH}/categories`, mock)
  return res.data
}

/** 获取排名数据 */
export async function fetchRanking(): Promise<RankingItem[]> {
  const mock = isMock ? getRealtimeSnapshot().ranking : getMockDashboardData().ranking
  const res = await fetchData(`${API_PATH}/ranking`, mock)
  return res.data
}

/** 获取雷达数据 */
export async function fetchRadar(): Promise<RadarDimension[]> {
  const mock = isMock ? getRealtimeSnapshot().radar : getMockDashboardData().radar
  const res = await fetchData(`${API_PATH}/radar`, mock)
  return res.data
}

/** 获取动态活动列表 */
export async function fetchActivities(): Promise<ActivityItem[]> {
  const mock = isMock ? getRealtimeSnapshot().activities : getMockDashboardData().activities
  const res = await fetchData(`${API_PATH}/activities`, mock)
  return res.data
}

/** 获取数据中枢节点 */
export async function fetchHubNodes(): Promise<HubNode[]> {
  const mock = isMock ? getRealtimeSnapshot().hubNodes : getMockDashboardData().hubNodes
  const res = await fetchData(`${API_PATH}/hub-nodes`, mock)
  return res.data
}

/** 获取完整仪表盘数据 */
export async function fetchDashboardAll(): Promise<DashboardData> {
  const mock = isMock ? getRealtimeSnapshot() : getMockDashboardData()
  const res = await fetchData(`${API_PATH}/all`, mock)
  return res.data
}

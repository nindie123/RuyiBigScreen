/**
 * 如意数据大屏 - 类型定义
 * 所有数据模型的 TypeScript 接口定义
 */

/** 核心指标 */
export interface SummaryMetrics {
  todayVisits: number
  realtimeOrders: number
  activeUsers: number
  systemHealth: number
}

/** 趋势数据点 */
export interface TrendDataPoint {
  date: string
  value: number
  prevValue?: number
}

/** 分类分布 */
export interface CategoryItem {
  name: string
  value: number
  percentage?: number
}

/** 排名数据项 */
export interface RankingItem {
  rank: number
  name: string
  value: number
  change: 'up' | 'down' | 'stable'
}

/** 雷达图维度 */
export interface RadarDimension {
  name: string
  value: number
  max: number
}

/** 动态活动项 */
export interface ActivityItem {
  id: string
  type: 'alert' | 'info' | 'warning' | 'success'
  message: string
  time: string
  source?: string
}

/** 数据中枢节点 */
export interface HubNode {
  id: string
  name: string
  value: number
  coord: [number, number]
  status: 'good' | 'warning' | 'danger'
  description: string
}

/** 仪表盘完整数据 */
export interface DashboardData {
  summary: SummaryMetrics
  trend: TrendDataPoint[]
  categories: CategoryItem[]
  ranking: RankingItem[]
  radar: RadarDimension[]
  activities: ActivityItem[]
  hubNodes: HubNode[]
}

/** 数据源类型 */
export type DataSourceType = 'mock' | 'api'

/** API 响应格式 */
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
  timestamp: number
}

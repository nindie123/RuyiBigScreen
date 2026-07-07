/**
 * 如意数据大屏 - Mock 数据
 *
 * 提供真实的模拟数据，模拟 API 响应。
 * 数据通过 MSW handlers 分发，不直接暴露给组件。
 */

import type {
  SummaryMetrics,
  TrendDataPoint,
  CategoryItem,
  RankingItem,
  RadarDimension,
  ActivityItem,
  DashboardData,
} from '../types/dashboard'

/** 生成过去 N 天的日期列表 */
function generateDates(days: number): string[] {
  const dates: string[] = []
  const now = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    dates.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`)
  }
  return dates
}

export const mockSummary: SummaryMetrics = {
  todayVisits: 128946,
  realtimeOrders: 3582,
  activeUsers: 28761,
  systemHealth: 98.6,
}

export const mockTrend: TrendDataPoint[] = generateDates(14).map((date, index) => {
  const base = 80000 + Math.random() * 70000
  const prevBase = index > 0
    ? 80000 + Math.random() * 70000
    : base * 0.95
  return {
    date,
    value: Math.round(base),
    prevValue: Math.round(prevBase),
  }
})

// 确保最后一个值是最高点，看起来趋势良好
if (mockTrend.length > 0) {
  const last = mockTrend[mockTrend.length - 1]
  last.value = 128946
  last.prevValue = 112000
}

export const mockCategories: CategoryItem[] = [
  { name: '科技', value: 35, percentage: 35 },
  { name: '教育', value: 22, percentage: 22 },
  { name: '医疗', value: 18, percentage: 18 },
  { name: '金融', value: 15, percentage: 15 },
  { name: '其他', value: 10, percentage: 10 },
]

export const mockRanking: RankingItem[] = [
  { rank: 1, name: '北京', value: 98652, change: 'up' },
  { rank: 2, name: '上海', value: 87521, change: 'up' },
  { rank: 3, name: '深圳', value: 76213, change: 'down' },
  { rank: 4, name: '杭州', value: 65487, change: 'up' },
  { rank: 5, name: '广州', value: 58321, change: 'stable' },
  { rank: 6, name: '成都', value: 49876, change: 'down' },
  { rank: 7, name: '武汉', value: 41265, change: 'up' },
  { rank: 8, name: '南京', value: 36542, change: 'stable' },
]

export const mockRadar: RadarDimension[] = [
  { name: '系统性能', value: 92, max: 100 },
  { name: '数据安全', value: 88, max: 100 },
  { name: '用户体验', value: 85, max: 100 },
  { name: '业务覆盖', value: 78, max: 100 },
  { name: '创新能力', value: 90, max: 100 },
  { name: '运维效率', value: 82, max: 100 },
]

export const mockActivities: ActivityItem[] = [
  { id: 'A001', type: 'info', message: '系统完成每日数据备份', time: '2024-01-15 08:00:00', source: '系统' },
  { id: 'A002', type: 'success', message: '订单处理模块通过压力测试', time: '2024-01-15 08:15:00', source: '监控' },
  { id: 'A003', type: 'warning', message: 'API 响应时间超过 200ms 阈值', time: '2024-01-15 08:22:00', source: '性能' },
  { id: 'A004', type: 'info', message: '新增 3 个数据节点部署完成', time: '2024-01-15 08:30:00', source: '运维' },
  { id: 'A005', type: 'alert', message: '检测到异常登录尝试，已自动拦截', time: '2024-01-15 08:35:00', source: '安全' },
  { id: 'A006', type: 'success', message: '数据同步任务全部完成', time: '2024-01-15 08:40:00', source: '数据' },
  { id: 'A007', type: 'info', message: '内容分发网络 CDN 刷新完成', time: '2024-01-15 08:45:00', source: '运维' },
  { id: 'A008', type: 'warning', message: '数据库连接池使用率达 75%', time: '2024-01-15 08:50:00', source: '数据库' },
  { id: 'A009', type: 'info', message: '用户反馈模块上线新版本', time: '2024-01-15 09:00:00', source: '产品' },
  { id: 'A010', type: 'success', message: '夜间批量任务顺利完成', time: '2024-01-15 09:05:00', source: '调度' },
]

/** 聚合的完整仪表盘数据 */
export function getMockDashboardData(): DashboardData {
  return {
    summary: mockSummary,
    trend: mockTrend,
    categories: mockCategories,
    ranking: mockRanking,
    radar: mockRadar,
    activities: mockActivities,
  }
}

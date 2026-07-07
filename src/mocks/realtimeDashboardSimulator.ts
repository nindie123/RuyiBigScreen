/**
 * 如意数据大屏 - 实时数据模拟器
 *
 * 在纯前端环境下模拟真实业务系统的数据持续刷新。
 * 基于上一帧数据生成合理的下一帧数据，所有变化都在可控范围内。
 *
 * 使用方式（mock 模式下）：
 *   import { nextFrame } from './realtimeDashboardSimulator'
 *   const data = nextFrame() // 每次调用获取最新一帧数据
 *
 * 各模块刷新频率：
 *   - summary:      每帧 (2s)   — 访问量递增，订单波动，活跃用户微调，健康度保持
 *   - trend:         每 3 帧     — 追加新时间点，移除最旧点，保持窗口大小
 *   - activities:    每 2~3 帧   — 随机插入新动态消息，保留最近 8 条
 *   - hubNodes:      每帧        — 节点 value 小幅波动，status 按阈值重算
 *   - ranking:       每 4~5 帧   — 各城市访问量递增，重新排序
 *   - categories:    每 5~7 帧   — 占比微调，归一化到 100
 *   - radar:         每 15 帧    — 低频微调 (约 30s)
 */

import type {
  DashboardData,
  TrendDataPoint,
  ActivityItem,
} from '../types/dashboard'
import { getMockDashboardData } from './dashboardMock'
import { logger } from '../logs/logger'

// ──────────────────────────────────────────────
// 内部状态（深拷贝的 DashboardData，不与静态 mock 共享引用）
// ──────────────────────────────────────────────

let state: DashboardData | null = null
let frameCount = 0

/** 消息池 - 教学数据中心场景 */
const MESSAGE_POOL: Array<{ message: string; source: string }> = [
  { message: '北京学习中心完成新一轮访问数据同步', source: '数据' },
  { message: '可视化案例库同步 12 条练习记录', source: '系统' },
  { message: '学员端新增一批项目实战提交', source: '学员端' },
  { message: '教师端发布新的课堂任务', source: '教师端' },
  { message: '数据质量巡检通过，异常值已自动标记', source: '质量' },
  { message: '华东节点接口延迟轻微升高，已切换备用通道', source: '节点' },
  { message: '问答互动区新增高频问题聚类结果', source: '问答' },
  { message: '课程学习模块数据缓存刷新完成', source: '系统' },
  { message: '资源下载 CDN 预热任务执行完毕', source: '运维' },
  { message: '告警中心发现轻微波动，正在持续观察', source: '告警' },
  { message: '项目实战评分系统完成本轮评估', source: '项目' },
  { message: '学员活跃度较上一时段上升 5%', source: '分析' },
  { message: '教师批改队列积压已降至正常水平', source: '教师端' },
  { message: '数据服务层完成主备切换演练', source: '数据' },
  { message: '问答区本周新增优质回答 230 条', source: '问答' },
  { message: '学习资料库 PDF 预览功能验证通过', source: '下载' },
  { message: '系统负载均衡策略已自动优化', source: '系统' },
  { message: '持续集成流水线构建耗时缩短 15%', source: '运维' },
]

const TREND_WINDOW = 10
const MAX_ACTIVITIES = 8
let activityCounter = 0

// ──────────────────────────────────────────────
// 初始化
// ──────────────────────────────────────────────

/** 从静态 mock 数据初始化实时状态（深拷贝，避免引用共享） */
function initialize(): void {
  const mock = getMockDashboardData()
  const s = JSON.parse(JSON.stringify(mock)) as DashboardData
  // 趋势初始数据只保留 TREND_WINDOW 个点，滑动窗口从初始开始生效
  if (s.trend.length > TREND_WINDOW) {
    s.trend = s.trend.slice(s.trend.length - TREND_WINDOW)
  }
  // 活动列表初始只保留 MAX_ACTIVITIES 条
  if (s.activities.length > MAX_ACTIVITIES) {
    s.activities = s.activities.slice(0, MAX_ACTIVITIES)
  }
  state = s
  frameCount = 0
  logger.info('[RealtimeSimulator] 实时模拟器已初始化')
}

// ──────────────────────────────────────────────
// 公共入口
// ──────────────────────────────────────────────

/** 获取当前状态（确保已初始化） */
function ensureState(): DashboardData {
  if (!state) initialize()
  return state!
}

/**
 * 获取下一帧数据。
 * 每次调用推进一帧，各模块按预设频率更新。
 */
export function nextFrame(): DashboardData {
  const s = ensureState()
  frameCount++

  // 按频率依次更新各模块
  updateSummary()
  if (frameCount % 3 === 0) updateTrendWindow()
  if (frameCount % 2 === 0 || Math.random() < 0.4) createActivity()
  updateHubNodes()
  if (frameCount % 4 === 0) updateRanking()
  if (frameCount % 5 === 0) updateCategories()
  if (frameCount % 15 === 0) updateRadar()

  return s
}

/**
 * 重置模拟器到初始状态（测试用）
 */
export function resetSimulator(): void {
  state = null
  frameCount = 0
}

/**
 * 获取当前帧计数（测试用）
 */
export function getFrameCount(): number {
  return frameCount
}

// ──────────────────────────────────────────────
// Summary 核心指标
// ──────────────────────────────────────────────

function updateSummary(): void {
  const s = state!.summary

  // 今日访问量：只增不降，每次 +20~300
  s.todayVisits += Math.floor(Math.random() * 281) + 20

  // 实时订单数：大多数时候递增，可小幅波动，0~80
  const orderDelta = Math.floor(Math.random() * 81)
  s.realtimeOrders += orderDelta

  // 活跃用户数：上下浮动 1%~3%
  const userDelta = Math.round(s.activeUsers * (Math.random() * 0.02 + 0.005))
  s.activeUsers += Math.random() < 0.5 ? userDelta : -userDelta
  if (s.activeUsers < 1000) s.activeUsers = 1000

  // 系统健康度：保持在 95~99.9，偶尔小降
  const healthDrift = (Math.random() - 0.45) * 0.6
  s.systemHealth = Math.min(99.9, Math.max(95, s.systemHealth + healthDrift))
  s.systemHealth = Math.round(s.systemHealth * 10) / 10
}

// ──────────────────────────────────────────────
// Trend 访问趋势（滑动窗口）
// ──────────────────────────────────────────────

function updateTrendWindow(): void {
  const s = state!
  const now = new Date()
  const timeLabel =
    String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0')

  const newPoint: TrendDataPoint = {
    date: timeLabel,
    value: s.summary.todayVisits + Math.floor(Math.random() * 500),
    prevValue: s.trend.length > 0 ? s.trend[s.trend.length - 1].value : s.summary.todayVisits,
  }

  s.trend.push(newPoint)

  // 保留最近 TREND_WINDOW 个点
  if (s.trend.length > TREND_WINDOW) {
    s.trend = s.trend.slice(s.trend.length - TREND_WINDOW)
  }
}

// ──────────────────────────────────────────────
// Activities 实时动态
// ──────────────────────────────────────────────

function createActivity(): void {
  const s = state!
  activityCounter++

  const now = new Date()
  const timeStr =
    String(now.getHours()).padStart(2, '0') +
    ':' +
    String(now.getMinutes()).padStart(2, '0') +
    ':' +
    String(now.getSeconds()).padStart(2, '0')

  // 随机选一条消息
  const pool = MESSAGE_POOL
  const msgIndex = Math.floor(Math.random() * pool.length)
  const msg = pool[msgIndex]

  // 15%~25% 概率为 warning，其余 info / success
  let level: ActivityItem['type']
  const r = Math.random()
  if (r < 0.2) level = 'warning'
  else if (r < 0.55) level = 'info'
  else level = 'success'

  const newActivity: ActivityItem = {
    id: `RT-${String(activityCounter).padStart(4, '0')}`,
    type: level,
    message: msg.message,
    time: timeStr,
    source: msg.source,
  }

  // 插入到最前面
  s.activities.unshift(newActivity)

  // 只保留最近 MAX_ACTIVITIES 条
  if (s.activities.length > MAX_ACTIVITIES) {
    s.activities = s.activities.slice(0, MAX_ACTIVITIES)
  }
}

// ──────────────────────────────────────────────
// HubNodes 数据中枢节点
// ──────────────────────────────────────────────

function updateHubNodes(): void {
  const s = state!
  for (const node of s.hubNodes) {
    if (node.id === 'center') continue // 中枢节点固定 100

    const delta = Math.floor(Math.random() * 10) - 4 // -4~+5
    node.value = Math.max(40, Math.min(100, node.value + delta))

    // 按 value 阈值设置 status
    if (node.value >= 70) node.status = 'good'
    else if (node.value >= 55) node.status = 'warning'
    else node.status = 'danger'

    // description 随状态轻微变化
    if (node.status === 'warning' && !node.description.includes('偏高')) {
      node.description = node.description.replace(/保持高活跃|稳定增长|持续上升|创近期新高/, '负载偏高')
    }
    if (node.status === 'good' && node.description.includes('偏高')) {
      node.description = node.description.replace('负载偏高', '已恢复稳定')
    }
  }
}

// ──────────────────────────────────────────────
// Ranking 城市排名
// ──────────────────────────────────────────────

function updateRanking(): void {
  const items = state!.ranking

  // 每个城市 value 小幅递增
  for (const item of items) {
    const increment = Math.floor(Math.random() * 60) + 10
    item.value += increment
  }

  // 按 value 降序重排
  items.sort((a, b) => b.value - a.value)

  // 重新分配 rank 和 change
  for (let i = 0; i < items.length; i++) {
    const prevRank = items[i].rank
    items[i].rank = i + 1
    if (items[i].rank < prevRank) items[i].change = 'up'
    else if (items[i].rank > prevRank) items[i].change = 'down'
    else items[i].change = 'stable'
  }
}

// ──────────────────────────────────────────────
// Categories 分类占比
// ──────────────────────────────────────────────

function updateCategories(): void {
  const cats = state!.categories

  // 每项微调 -2~+3
  for (const cat of cats) {
    const delta = Math.floor(Math.random() * 6) - 2
    cat.value = Math.max(5, cat.value + delta)
  }

  // 归一化到总和 100
  const total = cats.reduce((sum, c) => sum + c.value, 0)
  for (const cat of cats) {
    cat.percentage = Math.round((cat.value / total) * 100)
    cat.value = cat.percentage
  }

  // 由于取整可能丢精度，把差值补到最大的分类
  const newTotal = cats.reduce((sum, c) => sum + c.value, 0)
  if (newTotal !== 100) {
    const max = cats.reduce((a, b) => (a.value > b.value ? a : b))
    max.value += 100 - newTotal
    max.percentage = max.value
  }
}

// ──────────────────────────────────────────────
// Radar 能力雷达
// ──────────────────────────────────────────────

function updateRadar(): void {
  for (const dim of state!.radar) {
    const delta = Math.floor(Math.random() * 5) - 2 // -2~+2
    dim.value = Math.max(50, Math.min(100, dim.value + delta))
  }
}

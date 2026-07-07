/**
 * 如意数据大屏 - MSW 请求处理器
 *
 * 定义所有 mock API 的路由和处理逻辑。
 * 请求路径以 /api/ 开头，方便后期切换到真实 API。
 */

import { http, HttpResponse } from 'msw'
import {
  mockSummary,
  mockTrend,
  mockCategories,
  mockRanking,
  mockRadar,
  mockActivities,
} from './dashboardMock'

/** 基础 API 路径 */
const API_BASE = '/api'

/**
 * 创建统一响应格式
 */
function createResponse<T>(data: T) {
  return {
    code: 200,
    message: 'success',
    data,
    timestamp: Date.now(),
  }
}

export const handlers = [
  /** 获取核心指标 */
  http.get(`${API_BASE}/dashboard/summary`, () => {
    return HttpResponse.json(createResponse(mockSummary))
  }),

  /** 获取趋势数据 */
  http.get(`${API_BASE}/dashboard/trend`, () => {
    return HttpResponse.json(createResponse(mockTrend))
  }),

  /** 获取分类分布 */
  http.get(`${API_BASE}/dashboard/categories`, () => {
    return HttpResponse.json(createResponse(mockCategories))
  }),

  /** 获取排名数据 */
  http.get(`${API_BASE}/dashboard/ranking`, () => {
    return HttpResponse.json(createResponse(mockRanking))
  }),

  /** 获取雷达数据 */
  http.get(`${API_BASE}/dashboard/radar`, () => {
    return HttpResponse.json(createResponse(mockRadar))
  }),

  /** 获取动态活动列表 */
  http.get(`${API_BASE}/dashboard/activities`, () => {
    return HttpResponse.json(createResponse(mockActivities))
  }),

  /** 获取完整仪表盘数据（一次性获取所有） */
  http.get(`${API_BASE}/dashboard/all`, () => {
    return HttpResponse.json(
      createResponse({
        summary: mockSummary,
        trend: mockTrend,
        categories: mockCategories,
        ranking: mockRanking,
        radar: mockRadar,
        activities: mockActivities,
      })
    )
  }),
]

/**
 * 如意数据大屏 - 数据源切换
 *
 * 统一的数据源管理机制：
 * - VITE_DATA_SOURCE=mock   → 使用 MSW mock 数据（默认）
 * - VITE_DATA_SOURCE=api    → 使用真实 Axios API 请求
 *
 * 所有数据请求都必须通过此模块。
 * 组件和服务模块不可直接读取 mock 文件。
 */

import type { DataSourceType } from '../types/dashboard'
import { logger } from '../logs/logger'

/** 当前数据源类型 */
export const dataSourceType: DataSourceType =
  (import.meta.env.VITE_DATA_SOURCE as DataSourceType) || 'mock'

/** 是否使用 mock 数据 */
export const isMock: boolean = dataSourceType === 'mock'

/** 获取 API 基础路径 */
export function getApiBaseUrl(): string {
  return import.meta.env.VITE_API_BASE_URL || '/api'
}

logger.info(`[DataSource] 当前数据源: ${dataSourceType === 'mock' ? 'Mock 数据' : '真实 API'}`)

/**
 * 如意数据大屏 - MSW Browser Worker
 *
 * 在浏览器环境中启动 MSW，拦截请求并返回 mock 数据。
 * 仅在 VITE_DATA_SOURCE=mock 时启用。
 */

import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)

/**
 * 如意数据大屏 - HTTP 客户端
 *
 * 基于 Axios 的请求封装。
 * 提供统一的基础配置、请求/响应拦截器。
 */

import axios from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { logger } from '../logs/logger'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

/** 创建 Axios 实例 */
const httpClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

/** 请求拦截器 */
httpClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    logger.debug(`[HTTP] ${config.method?.toUpperCase()} ${config.url}`, {
      params: config.params,
    })

    // TODO: 在这里添加 Token 等认证信息
    // const token = getToken()
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }

    return config
  },
  (error) => {
    logger.error('[HTTP] Request Error', error)
    return Promise.reject(error)
  }
)

/** 响应拦截器 */
httpClient.interceptors.response.use(
  (response: AxiosResponse) => {
    const { config, data } = response
    logger.debug(`[HTTP] ${config.method?.toUpperCase()} ${config.url} - ${response.status}`)
    return data
  },
  (error) => {
    if (error.response) {
      const { status, config } = error.response
      logger.error(`[HTTP] Response Error ${status}`, {
        url: config?.url,
        message: error.message,
      })
    } else if (error.request) {
      logger.error('[HTTP] No Response', { message: error.message })
    } else {
      logger.error('[HTTP] Setup Error', { message: error.message })
    }
    return Promise.reject(error)
  }
)

export default httpClient

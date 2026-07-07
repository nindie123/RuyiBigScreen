/**
 * 如意数据大屏 - 日志系统
 *
 * 提供统一的日志记录接口。
 * 开发环境输出到 console，后续可接入 Sentry 等日志平台。
 *
 * 日志级别: debug < info < warn < error
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

/** 日志条目 */
export interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  data?: unknown
}

class Logger {
  private level: LogLevel = 'debug'

  private readonly levels: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  }

  constructor() {
    this.level = this.detectLevel()
  }

  /**
   * 根据环境变量检测日志级别
   */
  private detectLevel(): LogLevel {
    if (import.meta.env.VITE_LOG_LEVEL) {
      const level = import.meta.env.VITE_LOG_LEVEL as LogLevel
      if (this.levels[level] !== undefined) return level
    }
    return import.meta.env.DEV ? 'debug' : 'info'
  }

  /**
   * 判断当前级别是否允许输出
   */
  private shouldLog(level: LogLevel): boolean {
    return this.levels[level] >= this.levels[this.level]
  }

  /**
   * 创建日志条目
   */
  private createEntry(level: LogLevel, message: string, data?: unknown): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      data,
    }
  }

  /**
   * 输出日志到 console
   */
  private output(entry: LogEntry): void {
    if (!this.shouldLog(entry.level)) return

    const prefix = `[${entry.timestamp}] [${entry.level.toUpperCase()}]`

    switch (entry.level) {
      case 'debug':
        // eslint-disable-next-line no-console
        console.debug(prefix, entry.message, entry.data ?? '')
        break
      case 'info':
        // eslint-disable-next-line no-console
        console.info(prefix, entry.message, entry.data ?? '')
        break
      case 'warn':
        // eslint-disable-next-line no-console
        console.warn(prefix, entry.message, entry.data ?? '')
        break
      case 'error':
        // eslint-disable-next-line no-console
        console.error(prefix, entry.message, entry.data ?? '')
        break
    }
  }

  /**
   * 发送日志到外部平台（预留接口）
   * 后续可集成 Sentry 等
   */
  private async sendToPlatform(entry: LogEntry): Promise<void> {
    // TODO: 集成 Sentry 或其他日志平台
    // if (import.meta.env.PROD) {
    //   Sentry.captureMessage(entry.message, { level: entry.level, extra: { data: entry.data } })
    // }
    if (entry.level === 'error') {
      // 错误级别日志可发送到监控平台
      // 目前只是预留
    }
  }

  debug(message: string, data?: unknown): void {
    const entry = this.createEntry('debug', message, data)
    this.output(entry)
  }

  info(message: string, data?: unknown): void {
    const entry = this.createEntry('info', message, data)
    this.output(entry)
  }

  warn(message: string, data?: unknown): void {
    const entry = this.createEntry('warn', message, data)
    this.output(entry)
  }

  error(message: string, data?: unknown): void {
    const entry = this.createEntry('error', message, data)
    this.output(entry)
    // 错误同步发送到平台，不阻塞
    this.sendToPlatform(entry)
  }
}

export const logger = new Logger()

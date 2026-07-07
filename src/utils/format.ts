/**
 * 如意数据大屏 - 格式化工具
 */

/**
 * 格式化数字，添加千分位逗号
 * @param value - 要格式化的数字
 * @param decimals - 小数位数（默认 0）
 */
export function formatNumber(value: number, decimals = 0): string {
  if (value === null || value === undefined || isNaN(value)) return '0'
  return value.toLocaleString('zh-CN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

/**
 * 格式化百分比
 * @param value - 0~1 之间的小数
 * @param decimals - 小数位数（默认 1）
 */
export function formatPercent(value: number, decimals = 1): string {
  if (value === null || value === undefined || isNaN(value)) return '0%'
  return `${(value * 100).toFixed(decimals)}%`
}

/**
 * 数值缩写（万、亿）
 * @param value - 要缩写的数字
 */
export function formatCompactNumber(value: number): string {
  if (value === null || value === undefined || isNaN(value)) return '0'
  if (value >= 100000000) {
    return `${(value / 100000000).toFixed(2)}亿`
  }
  if (value >= 10000) {
    return `${(value / 10000).toFixed(1)}万`
  }
  return formatNumber(value)
}

/**
 * 格式化日期时间
 * @param date - Date 对象或时间戳
 * @param format - 格式模板，默认 'YYYY-MM-DD HH:mm:ss'
 */
export function formatDate(date: Date | number | string, format = 'YYYY-MM-DD HH:mm:ss'): string {
  const d = typeof date === 'object' ? date : new Date(date)
  if (isNaN(d.getTime())) return '--'

  const map: Record<string, number | string> = {
    YYYY: d.getFullYear(),
    MM: String(d.getMonth() + 1).padStart(2, '0'),
    DD: String(d.getDate()).padStart(2, '0'),
    HH: String(d.getHours()).padStart(2, '0'),
    mm: String(d.getMinutes()).padStart(2, '0'),
    ss: String(d.getSeconds()).padStart(2, '0'),
  }

  let result = format
  for (const [key, value] of Object.entries(map)) {
    result = result.replace(key, String(value))
  }
  return result
}

/**
 * 获取当前时间的格式化字符串
 */
export function getCurrentTime(): string {
  return formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss')
}

/**
 * 格式化数字为带单位的字符串
 * @param value - 数字
 * @param unit - 单位
 */
export function formatWithUnit(value: number, unit: string): string {
  return `${formatNumber(value)} ${unit}`
}

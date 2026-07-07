/**
 * 如意数据大屏 - 格式化工具单元测试
 */

import { describe, it, expect } from 'vitest'
import { formatNumber, formatPercent, formatCompactNumber, formatDate, getCurrentTime } from '../../utils/format'

describe('formatNumber', () => {
  it('should format numbers with commas', () => {
    expect(formatNumber(1000)).toBe('1,000')
    expect(formatNumber(1234567)).toBe('1,234,567')
    expect(formatNumber(0)).toBe('0')
  })

  it('should handle decimal places', () => {
    expect(formatNumber(1234.567, 2)).toBe('1,234.57')
    expect(formatNumber(100.5, 1)).toBe('100.5')
  })

  it('should handle edge cases', () => {
    expect(formatNumber(null as unknown as number)).toBe('0')
    expect(formatNumber(undefined as unknown as number)).toBe('0')
    expect(formatNumber(NaN)).toBe('0')
  })
})

describe('formatPercent', () => {
  it('should format as percentage', () => {
    expect(formatPercent(0.5)).toBe('50.0%')
    expect(formatPercent(0.986)).toBe('98.6%')
    expect(formatPercent(1)).toBe('100.0%')
  })

  it('should handle decimals param', () => {
    expect(formatPercent(0.3333, 2)).toBe('33.33%')
  })

  it('should handle edge cases', () => {
    expect(formatPercent(NaN)).toBe('0%')
    expect(formatPercent(null as unknown as number)).toBe('0%')
  })
})

describe('formatCompactNumber', () => {
  it('should format numbers in 万', () => {
    expect(formatCompactNumber(12345)).toBe('1.2万')
    expect(formatCompactNumber(10000)).toBe('1.0万')
  })

  it('should format numbers in 亿', () => {
    expect(formatCompactNumber(100000000)).toBe('1.00亿')
    expect(formatCompactNumber(123456789)).toBe('1.23亿')
  })

  it('should return original number for small values', () => {
    expect(formatCompactNumber(999)).toBe('999')
    expect(formatCompactNumber(0)).toBe('0')
  })

  it('should handle edge cases', () => {
    expect(formatCompactNumber(NaN)).toBe('0')
    expect(formatCompactNumber(null as unknown as number)).toBe('0')
  })
})

describe('formatDate', () => {
  it('should format Date object', () => {
    const date = new Date(2024, 0, 15, 8, 30, 0) // Jan 15, 2024 08:30:00
    expect(formatDate(date, 'YYYY-MM-DD')).toBe('2024-01-15')
    expect(formatDate(date, 'HH:mm:ss')).toBe('08:30:00')
    expect(formatDate(date, 'YYYY-MM-DD HH:mm:ss')).toBe('2024-01-15 08:30:00')
  })

  it('should handle string input', () => {
    expect(formatDate('2024-01-15', 'YYYY-MM-DD')).toBe('2024-01-15')
  })

  it('should handle edge cases', () => {
    expect(formatDate('invalid-date')).toBe('--')
  })
})

describe('getCurrentTime', () => {
  it('should return current time string', () => {
    const result = getCurrentTime()
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
  })
})

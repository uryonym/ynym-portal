import { describe, it, expect } from 'vitest'

import {
  formatDisplayDate,
  formatDisplayDateTime,
  toDatetimeLocalValue,
  toUtcIsoString,
  parseDateString,
} from '../date'

describe('date utility functions', () => {
  describe('formatDisplayDate', () => {
    it('formats valid Date object with default format', () => {
      const date = new Date(2026, 2, 15) // 2026-03-15
      expect(formatDisplayDate(date)).toBe('3月15日')
    })

    it('formats valid date string with custom format', () => {
      expect(formatDisplayDate('2026-03-15T00:00:00', 'yyyy/MM/dd')).toBe(
        '2026/03/15',
      )
    })

    it('returns empty string for null or undefined', () => {
      expect(formatDisplayDate(null)).toBe('')
      expect(formatDisplayDate(undefined)).toBe('')
      expect(formatDisplayDate('')).toBe('')
    })

    it('returns empty string for invalid date', () => {
      expect(formatDisplayDate('invalid-date')).toBe('')
    })
  })

  describe('formatDisplayDateTime', () => {
    it('formats valid Date object with default format', () => {
      const date = new Date(2026, 2, 15, 14, 30)
      expect(formatDisplayDateTime(date)).toBe('3月15日 14:30')
    })

    it('returns empty string for null or undefined', () => {
      expect(formatDisplayDateTime(null)).toBe('')
      expect(formatDisplayDateTime(undefined)).toBe('')
    })

    it('returns empty string for invalid date', () => {
      expect(formatDisplayDateTime('invalid-date')).toBe('')
    })
  })

  describe('toDatetimeLocalValue', () => {
    it('formats Date to HTML datetime-local input string', () => {
      const date = new Date(2026, 2, 15, 9, 5)
      expect(toDatetimeLocalValue(date)).toBe('2026-03-15T09:05')
    })

    it('returns empty string for null or undefined', () => {
      expect(toDatetimeLocalValue(null)).toBe('')
      expect(toDatetimeLocalValue(undefined)).toBe('')
    })

    it('returns empty string for invalid date', () => {
      expect(toDatetimeLocalValue('invalid')).toBe('')
    })
  })

  describe('toUtcIsoString', () => {
    it('converts datetime-local string to UTC ISO string', () => {
      const result = toUtcIsoString('2026-03-15T12:00:00Z')
      expect(result).toBe('2026-03-15T12:00:00.000Z')
    })
  })

  describe('parseDateString', () => {
    it('parses formatted date string to Date object', () => {
      const result = parseDateString('2026/03/15', 'yyyy/MM/dd')
      expect(result.getFullYear()).toBe(2026)
      expect(result.getMonth()).toBe(2)
      expect(result.getDate()).toBe(15)
    })
  })
})

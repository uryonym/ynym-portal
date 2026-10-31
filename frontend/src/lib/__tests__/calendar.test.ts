import { describe, it, expect } from 'vitest'

import {
  DEFAULT_MEMBER_COLORS,
  SHARED_FAMILY_COLOR,
  getMemberColor,
  getEventColor,
  getEventColorInfo,
} from '../calendar'

import type { CalendarEvent } from '@/lib/types/event'

describe('calendar utility functions', () => {
  describe('getMemberColor', () => {
    it('returns custom color when specified', () => {
      expect(getMemberColor('user-1', '#ff0000')).toBe('#ff0000')
    })

    it('returns fallback gray color when no id and no color', () => {
      expect(getMemberColor()).toBe('#6b7280')
      expect(getMemberColor(undefined, null)).toBe('#6b7280')
    })

    it('returns deterministic palette color based on id', () => {
      const color1 = getMemberColor('user-abc')
      const color2 = getMemberColor('user-abc')
      expect(color1).toBe(color2)
      expect(DEFAULT_MEMBER_COLORS).toContain(color1)
    })
  })

  describe('getEventColor', () => {
    it('returns member color when single participant', () => {
      const event: CalendarEvent = {
        id: 'e1',
        title: '個人予定',
        start_at: '2026-03-15T10:00:00',
        end_at: '2026-03-15T11:00:00',
        is_all_day: false,
        is_private: false,
        created_by: 'user-1',
        created_at: '2026-03-01T00:00:00',
        updated_at: '2026-03-01T00:00:00',
        participants: [{ id: 'user-1', name: 'User 1', color: '#123456' }],
      }
      expect(getEventColor(event)).toBe('#123456')
    })

    it('returns SHARED_FAMILY_COLOR when no participants (family shared)', () => {
      const event: CalendarEvent = {
        id: 'e2',
        title: '家族予定',
        start_at: '2026-03-15T10:00:00',
        end_at: '2026-03-15T11:00:00',
        is_all_day: false,
        is_private: false,
        created_by: 'user-1',
        created_at: '2026-03-01T00:00:00',
        updated_at: '2026-03-01T00:00:00',
        participants: [],
      }
      expect(getEventColor(event)).toBe(SHARED_FAMILY_COLOR)
    })

    it('returns SHARED_FAMILY_COLOR when multiple participants', () => {
      const event: CalendarEvent = {
        id: 'e3',
        title: '複数人予定',
        start_at: '2026-03-15T10:00:00',
        end_at: '2026-03-15T11:00:00',
        is_all_day: false,
        is_private: false,
        created_by: 'user-1',
        created_at: '2026-03-01T00:00:00',
        updated_at: '2026-03-01T00:00:00',
        participants: [
          { id: 'user-1', name: 'User 1', color: '#123456' },
          { id: 'user-2', name: 'User 2', color: '#654321' },
        ],
      }
      expect(getEventColor(event)).toBe(SHARED_FAMILY_COLOR)
    })
  })

  describe('getEventColorInfo', () => {
    it('returns border, bg, text color styles', () => {
      const event: CalendarEvent = {
        id: 'e1',
        title: 'テスト予定',
        start_at: '2026-03-15T10:00:00',
        end_at: '2026-03-15T11:00:00',
        is_all_day: false,
        is_private: false,
        created_by: 'user-1',
        created_at: '2026-03-01T00:00:00',
        updated_at: '2026-03-01T00:00:00',
        participants: [],
      }
      const info = getEventColorInfo(event)
      expect(info.border).toBe(SHARED_FAMILY_COLOR)
      expect(info.bg).toBe(`${SHARED_FAMILY_COLOR}20`)
      expect(info.text).toBe(SHARED_FAMILY_COLOR)
    })
  })
})

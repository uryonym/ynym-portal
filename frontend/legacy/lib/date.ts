import { format, parse } from 'date-fns'
import { ja } from 'date-fns/locale'

/**
 * 日付を表示用文字列にフォーマット（例: "3月15日"）
 */
export function formatDisplayDate(
  date: string | Date | null | undefined,
  formatStr = 'M月d日',
): string {
  if (!date) return ''
  try {
    const d = typeof date === 'string' ? new Date(date) : date
    return isNaN(d.getTime()) ? '' : format(d, formatStr, { locale: ja })
  } catch {
    return ''
  }
}

/**
 * 日時を表示用文字列にフォーマット（例: "3月15日 14:30"）
 */
export function formatDisplayDateTime(
  date: string | Date | null | undefined,
  formatStr = 'M月d日 HH:mm',
): string {
  if (!date) return ''
  try {
    const d = typeof date === 'string' ? new Date(date) : date
    return isNaN(d.getTime()) ? '' : format(d, formatStr, { locale: ja })
  } catch {
    return ''
  }
}

/**
 * HTML datetime-local input 用の文字列（yyyy-MM-dd'T'HH:mm）に変換
 */
export function toDatetimeLocalValue(
  date: string | Date | null | undefined,
): string {
  if (!date) return ''
  try {
    const d = typeof date === 'string' ? new Date(date) : date
    return isNaN(d.getTime()) ? '' : format(d, "yyyy-MM-dd'T'HH:mm")
  } catch {
    return ''
  }
}

/**
 * ローカル日時文字列（datetime-local の値）を UTC の ISO 8601 文字列に変換
 */
export function toUtcIsoString(localDatetimeStr: string): string {
  const localDate = new Date(localDatetimeStr)
  return localDate.toISOString()
}

/**
 * 指定フォーマットの文字列を Date オブジェクトにパース
 */
export function parseDateString(
  dateStr: string,
  formatStr: string,
  baseDate: Date = new Date(),
): Date {
  return parse(dateStr, formatStr, baseDate, { locale: ja })
}

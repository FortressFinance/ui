import { DEFAULT_LOCALE } from "@/constant/locales"

export function localeNumber(
  num: number,
  options?: {
    compact?: boolean
    minimumFractionDigits?: number
    maximumFractionDigits?: number
  }
) {
  const formatter = Intl.NumberFormat(DEFAULT_LOCALE, {
    ...(options?.compact ? { notation: "compact" } : {}),
    minimumFractionDigits: options?.minimumFractionDigits,
    maximumFractionDigits: options?.maximumFractionDigits,
  })
  return formatter.format(num).toLocaleUpperCase()
}

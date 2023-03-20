import { localeNumber } from "@/lib/helpers"

export const formatPercentage = (value?: number | string) =>
  `${localeNumber(Number(value ?? "0") * 100, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}%`

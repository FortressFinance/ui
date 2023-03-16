import { SUPPORTED_LOCALES } from "@/constant/locales"

export function localeNumber(
  num: number,
  options?: {
    compact?: boolean
    minimumFractionDigits?: number
    maximumFractionDigits?: number
  }
) {
  const formatter = Intl.NumberFormat(currentLocale(), {
    ...(options?.compact ? { notation: "compact" } : {}),
    minimumFractionDigits: options?.minimumFractionDigits,
    maximumFractionDigits: options?.maximumFractionDigits,
  })
  return formatter.format(num).toLocaleUpperCase()
}

function currentLocale() {
  const browserLocales = getBrowserLocales()
  return browserLocales?.filter((l) => SUPPORTED_LOCALES.includes(l))
}

function getBrowserLocales(options = {}) {
  const defaultOptions = {
    languageCodeOnly: false,
  }

  const opt = {
    ...defaultOptions,

    ...options,
  }

  const browserLocales =
    navigator.languages === undefined
      ? [navigator.language]
      : navigator.languages

  if (!browserLocales) {
    return undefined
  }

  return browserLocales.map((locale) => {
    const trimmedLocale = locale.trim()

    return opt.languageCodeOnly ? trimmedLocale.split(/-|_/)[0] : trimmedLocale
  })
}

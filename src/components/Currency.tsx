import { BigNumber } from "ethers"
import { formatUnits } from "ethers/lib/utils.js"
import { FC, useMemo } from "react"

import { getBrowserLocales } from "@/lib/api/util/getBrowserLocales"

import { SUPPORTED_LOCALES } from "@/constant/locales"

export type CurrencyProps = {
  abbreviate?: boolean
  amount: number | BigNumber
  decimals: number
  symbol?: string
}

const Currency: FC<CurrencyProps> = ({
  abbreviate = false,
  amount,
  decimals,
  symbol = "",
}) => {
  const formatted = useMemo(() => {
    if (!abbreviate) return formatUnits(amount, decimals)
    if (amount instanceof BigNumber) {
      return abbreviatedBig(amount, decimals)
    } else {
      return abbreviated(amount)
    }
  }, [abbreviate, amount, decimals])

  return (
    <>
      {symbol}
      {formatted}
    </>
  )
}

export default Currency

const currentLocale = () => {
  const userLocales = getBrowserLocales()
  return userLocales?.filter((l) => SUPPORTED_LOCALES.includes(l))
}

const abbreviated = (amount: number) => {
  const locales = currentLocale()
  const formatter = Intl.NumberFormat(locales, {
    notation: "compact",
    maximumFractionDigits: 3,
  })
  return formatter.format(amount).toLocaleUpperCase()
}

const abbreviatedBig = (amount: BigNumber, decimals: number) => {
  const locales = currentLocale()
  const formatter = Intl.NumberFormat(locales, {
    notation: "compact",
    maximumFractionDigits: 3,
  })
  return formatter
    .format(Number(formatUnits(amount, decimals)))
    .toLocaleUpperCase()
}

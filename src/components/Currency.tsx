import { BigNumber } from "ethers"
import { formatUnits } from "ethers/lib/utils.js"
import { FC, useMemo } from "react"

import { localeNumber } from "@/lib/helpers"

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
    return !abbreviate
      ? formatUnits(amount, decimals)
      : amount instanceof BigNumber
      ? localeNumber(Number(formatUnits(amount, decimals)), {
          compact: true,
          maximumFractionDigits: 2,
        })
      : localeNumber(amount, { compact: true, maximumFractionDigits: 2 })
  }, [abbreviate, amount, decimals])

  return (
    <>
      {symbol}
      {formatted}
    </>
  )
}

export default Currency

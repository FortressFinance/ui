import { BigNumber } from "ethers"
import { formatUnits, parseUnits } from "ethers/lib/utils.js"
import { FC, useMemo } from "react"

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

const SUFFIXES = ["", "K", "M", "B", "T"]

const abbreviated = (amount: number) => {
  let i = 0
  let value = amount

  while (value >= 1000) {
    i++
    value = value / 1000
  }

  let str = String(value).match(/^-?\d+(?:\.\d{0,3})?/)?.[0]
  if (str?.indexOf(".") === -1) str += ".000"
  return str + SUFFIXES[i]
}

const abbreviatedBig = (amount: BigNumber, decimals: number) => {
  let i = 0
  let value = amount

  while (value.gte(parseUnits("1000", decimals))) {
    i++
    value = value.div(1000)
  }

  let str = formatUnits(value, decimals).match(/^-?\d+(?:\.\d{0,3})?/)?.[0]
  if (str?.indexOf(".") === -1) str += ".000"
  return str + SUFFIXES[i]
}

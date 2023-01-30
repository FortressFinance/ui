import { FC, useMemo } from "react"

type CurrencyProps = {
  abbreviate?: boolean
  children: number | string | undefined
  symbol?: string
}

const Currency: FC<CurrencyProps> = ({
  abbreviate = false,
  children,
  symbol = "",
}) => {
  const displayString = useMemo(() => {
    if (!abbreviate) return String(children)
    return abbreviateNumber(Number(children))
  }, [abbreviate, children])

  return (
    <>
      {symbol}
      {displayString}
    </>
  )
}

export default Currency

const SUFFIXES = ["", "K", "M", "B", "T"]

const abbreviateNumber = (num: number) => {
  let i = 0
  let value = num

  while (value >= 1000) {
    i++
    value /= 1000
  }

  let str = value.toString().match(/^-?\d+(?:\.\d{0,3})?/)?.[0]
  if (str?.indexOf(".") === -1) str += ".000"
  return str + SUFFIXES[i]
}

import { FC } from "react"

type CurrencyProps = {
  children: number | string | undefined
  symbol?: string
}

const Currency: FC<CurrencyProps> = ({ children, symbol = "" }) => {
  return (
    <>
      {symbol}
      {Number(children).toLocaleString()}
    </>
  )
}

export default Currency

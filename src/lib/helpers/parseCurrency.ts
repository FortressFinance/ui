import { parseUnits } from "ethers/lib/utils.js"

export const parseCurrencyUnits = ({
  amountFormatted = "0",
  decimals = 18,
}: {
  amountFormatted?: string
  decimals?: number
}) => {
  const formattedToDecimals = amountFormatted.includes(".")
    ? amountFormatted.substring(0, amountFormatted.indexOf(".") + decimals + 1)
    : amountFormatted || "0"
  return parseUnits(formattedToDecimals, decimals)
}

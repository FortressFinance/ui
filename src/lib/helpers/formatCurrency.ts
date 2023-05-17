import { formatUnits } from "ethers/lib/utils.js"

import { localeNumber } from "@/lib/helpers"

export const formatCurrencyUnits = ({
  amountWei = "0",
  decimals = 18,
  maximumFractionDigits,
}: {
  amountWei?: string
  decimals?: number
  maximumFractionDigits?: number
}) => {
  if (maximumFractionDigits !== undefined) {
    const formatted = formatUnits(amountWei, decimals)
    return formatted.startsWith("-")
      ? "0"
      : localeNumber(Number(formatted), {
          compact: true,
          maximumFractionDigits,
        })
  }
  const formatted = formatUnits(amountWei, decimals)
  return formatted.startsWith("-") ? "0" : formatted
}

export const formatUsd = ({
  abbreviate = false,
  amount = 0,
}: {
  abbreviate?: boolean
  amount?: number
}) =>
  `$${localeNumber(
    amount,
    abbreviate
      ? {
          compact: true,
          maximumFractionDigits: 2,
        }
      : {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }
  )}`

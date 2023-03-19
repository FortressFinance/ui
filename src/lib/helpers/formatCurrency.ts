import { formatUnits } from "ethers/lib/utils.js"

import { localeNumber } from "@/lib/helpers"

export const formatCurrencyUnits = ({
  abbreviate = false,
  amountWei = "0",
  decimals = 18,
}: {
  abbreviate?: boolean
  amountWei?: string
  decimals?: number
}) =>
  abbreviate
    ? localeNumber(Number(formatUnits(amountWei, decimals)), {
        compact: true,
        maximumFractionDigits: 2,
      })
    : formatUnits(amountWei, decimals)

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

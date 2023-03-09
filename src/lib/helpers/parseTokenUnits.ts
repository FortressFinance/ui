import { BigNumber } from "ethers"
import { parseUnits } from "ethers/lib/utils.js"

export function parseTokenUnits(amount = "0", decimals = 18) {
  const amountFloat = parseFloat(amount)

  return isNaN(amountFloat)
    ? BigNumber.from(0)
    : parseUnits(
        parseFloat(amount)
          .toFixed(decimals ?? 18)
          .toString(),
        decimals ?? 18
      )
}

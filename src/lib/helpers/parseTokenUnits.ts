import { BigNumber } from "ethers"
import { parseUnits } from "ethers/lib/utils.js"

export function parseTokenUnits(amount = "0", decimals?: number) {
  const amountNumber = Number(amount)
  return isNaN(amountNumber)
    ? BigNumber.from("0")
    : parseUnits(safeToFixed(amount, decimals ?? 18))
}

function safeToFixed(numberString: string, decimals: number) {
  const re = new RegExp("^-?\\d+(?:.\\d{0," + decimals + "})?")
  return numberString.match(re)?.[0] ?? "0"
}

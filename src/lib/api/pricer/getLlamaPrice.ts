import axios from "axios"
import { Address } from "wagmi"
import { z } from "zod"

const chainIdToPrefix: Record<number, string> = {
  1: "ethereum",
  42161: "arbitrum",
  31337: "ethereum",
  313371: "arbitrum",
}

const respSchema = z.object({
  coins: z.record(
    z.object({
      price: z.number(),
    })
  ),
})

export async function getLlamaPrice({
  asset,
  chainId = 1,
}: {
  asset: Address
  chainId?: number
}) {
  const chainPrefix = chainIdToPrefix[chainId]
  if (!chainPrefix) throw new Error("Unsupported chain")
  const llamaKey = `${chainPrefix}:${asset}`
  const resp = await axios.get(
    `https://coins.llama.fi/prices/current/${llamaKey}`
  )
  const parsed = respSchema.parse(resp.data)
  return parsed?.coins[llamaKey].price
}

import axios from "axios"
import { Address } from "wagmi"
import { z } from "zod"

const chainIdToPrefix: Record<number, string> = {
  1: "ethereum",
  42161: "arbitrum-one",
  31337: "ethereum",
  313371: "arbitrum-one",
}

const respSchema = z.record(
  z.string().toUpperCase(),
  z.object({ usd: z.number().optional() })
)

export async function getCoinGeckoPrice({
  asset,
  chainId = 1,
}: {
  asset: Address
  chainId?: number
}) {
  const chainPrefix = chainIdToPrefix[chainId]
  if (!chainPrefix) throw new Error("Unsupported chain")
  const resp = await axios.get(
    `https://api.coingecko.com/api/v3/simple/token_price/${chainPrefix}?contract_addresses=${asset}&vs_currencies=usd`
  )
  const parsed = respSchema.parse(resp.data)
  return parsed[asset.toUpperCase()]?.usd
}

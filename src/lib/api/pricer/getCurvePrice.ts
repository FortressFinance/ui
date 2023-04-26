import axios from "axios"
import { Address } from "wagmi"
import { z } from "zod"

const chainIdToPrefix: Record<number, string> = {
  1: "ethereum",
  42161: "arbitrum",
  31337: "ethereum",
  313371: "arbitrum",
}

export const respSchema = z.object({
  data: z.object({
    poolData: z.array(
      z.object({
        id: z.string(),
        address: z.string(),
        name: z.string(),
        lpTokenAddress: z.string(),
        virtualPrice: z.string(),
        symbol: z.string().optional(),
        coins: z.array(
          z.object({
            address: z.string(),
            usdPrice: z.number(),
          })
        ),
      })
    ),
  }),
})

export async function getCurvePrice({
  asset,
  chainId = 1,
}: {
  asset: Address
  chainId?: number
}) {
  const chainPrefix = chainIdToPrefix[chainId]
  if (!chainPrefix) throw new Error("Unsupported chain")
  const resp = await axios.get(
    `https://api.curve.fi/api/getPools/${chainPrefix}/main`
  )
  const parsed = respSchema.parse(resp.data)
  const filterCoin = parsed.data.poolData
    .flatMap((pool) => pool.coins)
    .filter((coin) => coin.address === asset)
  return filterCoin?.[0]?.usdPrice
}

import axios from "axios"
import { ethers } from "ethers"
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
        totalSupply: z.string(),
        symbol: z.string().optional(),
        coins: z.array(
          z.union([
            z.object({
              address: z.string(),
              decimals: z.number(),
              symbol: z.string(),
              usdPrice: z.number(),
              poolBalance: z.string(),
            }),
            z.object({
              address: z.string(),
              decimals: z.string(),
              symbol: z.string(),
              usdPrice: z.number(),
              poolBalance: z.string(),
            }),
          ])
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
  const poolAsset = parsed.data.poolData.filter(
    (pool) => pool.lpTokenAddress === asset
  )

  let lpTokenPrice = 0
  poolAsset.map((pool) => {
    let sumUnderlying = 0
    pool.coins.map((coin) => {
      sumUnderlying +=
        coin.usdPrice *
        parseFloat(
          ethers.utils.formatUnits(coin.poolBalance ?? "0", coin.decimals)
        )
    })
    lpTokenPrice =
      sumUnderlying / parseFloat(ethers.utils.formatUnits(pool.totalSupply, 18))
  })
  return lpTokenPrice
}

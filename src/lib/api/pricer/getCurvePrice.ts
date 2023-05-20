import axios from "axios"
import { formatUnits } from "viem"
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
          z.object({
            address: z.string(),
            decimals: z.union([z.string(), z.number()]),
            symbol: z.string(),
            usdPrice: z.number(),
            poolBalance: z.string(),
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
  const poolAsset = parsed.data.poolData.filter(
    (pool) => pool.lpTokenAddress === asset
  )

  let lpTokenPrice = 0
  poolAsset.forEach((pool) => {
    const sumUnderlying = pool.coins.reduce((acc, coin) => {
      return (
        acc +
        coin.usdPrice *
          parseFloat(
            formatUnits(BigInt(coin.poolBalance ?? "0"), Number(coin.decimals))
          )
      )
    }, 0)
    lpTokenPrice =
      sumUnderlying / parseFloat(formatUnits(BigInt(pool.totalSupply), 18))
  })
  return lpTokenPrice
}

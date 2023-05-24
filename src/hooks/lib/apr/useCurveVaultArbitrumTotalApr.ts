import axios from "axios"
import { Address, useQuery } from "wagmi"
import { z } from "zod"

import { useActiveChainId } from "@/hooks"

import {
  crvTriCryptoPoolAddress,
  crvTriCryptoTokenAddress,
  crvTwoCryptoTokenAddress,
  fraxBpTokenAddress,
} from "@/constant/addresses"
import { convexSidechainsUrl } from "@/constant/urls"

const ARBI_CURVE_ADDRESS: Record<Address, Address> = {
  [crvTriCryptoTokenAddress]: crvTriCryptoPoolAddress,
  [crvTwoCryptoTokenAddress]: crvTwoCryptoTokenAddress,
  [fraxBpTokenAddress]: fraxBpTokenAddress,
}

export default function useCurveVaultArbitrumTotalApr({
  asset,
  enabled,
}: {
  asset: Address
  enabled: boolean
}) {
  const breakdownApr = useCurveVaultArbitrumBreakdownApr({ asset, enabled })

  return {
    ...breakdownApr,
    data: !breakdownApr.data ? 0 : breakdownApr.data.totalApr,
  }
}

export function useCurveVaultArbitrumBreakdownApr({
  asset,
  enabled,
}: {
  asset: Address
  enabled: boolean
}) {
  const chainId = useActiveChainId()
  const poolCurveAddress = ARBI_CURVE_ADDRESS[asset] ?? "0x"
  const curveApiQuery = useQuery([chainId, asset, "curveApi"], {
    queryFn: () => getCurveArbitrumApi(poolCurveAddress),
    retry: false,
    enabled: enabled,
  })

  return curveApiQuery
}

const respSchema = z.object({
  apys: z.record(
    z.object({
      baseApy: z.number(),
      crvApy: z.number(),
      cvxApy: z.number(),
      crvBoost: z.string().or(z.number()),
      extraRewards: z.array(z.unknown()),
    })
  ),
})

async function getCurveArbitrumApi(poolCurveAddress: Address) {
  const resp = await axios.get(convexSidechainsUrl)
  const parsed = respSchema.parse(resp.data)
  return Object.entries(parsed.apys).reduce(
    (accumulator, [key, value]) => {
      if (
        poolCurveAddress !== "0x" &&
        key.toLowerCase().includes(poolCurveAddress.toLowerCase())
      ) {
        accumulator.baseApy = value.baseApy / 100;
        accumulator.crvApy = value.crvApy / 100;
        accumulator.cvxApy = value.cvxApy / 100;
        accumulator.totalApr = accumulator.baseApy + accumulator.crvApy + accumulator.cvxApy;
      }
      return accumulator;
    },
    { baseApy: 0, crvApy: 0, cvxApy: 0, totalApr: 0 }
  )
}

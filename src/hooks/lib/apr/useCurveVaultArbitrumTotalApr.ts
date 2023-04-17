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
  let crvApy = 0,
    cvxApy = 0,
    baseApy = 0
  Object.entries(parsed.apys).forEach(([key, value]) => {
    if (
      poolCurveAddress !== "0x" &&
      key.toLocaleLowerCase().includes(poolCurveAddress.toLocaleLowerCase())
    ) {
      baseApy = value.baseApy / 100
      crvApy = value.crvApy / 100
      cvxApy = value.cvxApy / 100
    }
  })
  return {
    baseApy,
    crvApy,
    cvxApy,
    totalApr: baseApy + crvApy + cvxApy,
  }
}

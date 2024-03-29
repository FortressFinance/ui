import axios from "axios"
import { Address } from "wagmi"
import { z } from "zod"

import { useActiveChainId, useQueryWithStatus } from "@/hooks"

import { ARBI_CURVE_ADDRESS } from "@/constant/addresses"
import { convexSidechainsUrl } from "@/constant/urls"

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
  enabled?: boolean
}) {
  const chainId = useActiveChainId()
  const poolCurveAddress = ARBI_CURVE_ADDRESS[asset] ?? "0x"
  const curveApiQuery = useQueryWithStatus({
    queryKey: [chainId, asset, "curveApi"],
    queryFn: () => getCurveArbitrumApi(poolCurveAddress),
    retry: false,
    enabled,
    keepPreviousData: enabled,
    refetchInterval: enabled ? 20000 : false,
    refetchIntervalInBackground: false,
  })

  return curveApiQuery
}

const respSchema = z.object({
  apys: z.record(
    z.object({
      baseApy: z.string().or(z.number()).or(z.null()),
      crvApy: z.string().or(z.number()).or(z.null()),
      cvxApy: z.string().or(z.number()).or(z.null()),
      crvBoost: z.string().or(z.number()).or(z.null()),
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
        accumulator.baseApr = Number(value.baseApy ?? 0) / 100
        accumulator.crvApr = Number(value.crvApy ?? 0) / 100
        accumulator.cvxApr = Number(value.cvxApy ?? 0) / 100
        accumulator.totalApr =
          accumulator.baseApr + accumulator.crvApr + accumulator.cvxApr
      }
      return accumulator
    },
    { baseApr: 0, crvApr: 0, cvxApr: 0, totalApr: 0 }
  )
}

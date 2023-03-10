import axios from "axios"
import { Address, useQuery } from "wagmi"

import { VaultDynamicProps } from "@/lib/types"
import useActiveChainId from "@/hooks/useActiveChainId"

import { CONVEX_SIDECHAINS_URL } from "@/constant/env"
import { ARBI_CURVE_ADDRESS } from "@/constant/mapping"

export default function useCurveVaultArbitrumTotalApr({
  asset,
  enabled,
}: {
  asset: VaultDynamicProps["asset"]
  enabled: boolean
}) {
  const chainId = useActiveChainId()
  const poolCurveAddress = ARBI_CURVE_ADDRESS[asset ?? "0x"] ?? "0x"
  const curveApiQuery = useQuery([chainId, asset, "curveApi"], {
    queryFn: () => getCurveArbitrumApi(poolCurveAddress),
    retry: false,
    enabled: enabled,
  })

  return curveApiQuery
}

async function getCurveArbitrumApi(poolCurveAddress: Address) {
  const resp = await axios.get(`${CONVEX_SIDECHAINS_URL}`)
  const apys = resp?.data?.apys
  let totalApr = 0
  Object.entries(apys).forEach((entry) => {
    const key = entry[0]
    const value: any = entry[1]
    if (
      key !== undefined &&
      key.toLocaleLowerCase().includes(poolCurveAddress.toLocaleLowerCase())
    ) {
      const baseApy = Number(value?.baseApy) / 100
      const crvApy = Number(value?.crvApy) / 100
      const cvxApy = Number(value?.cvxApy) / 100
      const extraRewards = Number(value?.extraRewards)
      totalApr = baseApy + crvApy + cvxApy + extraRewards
    }
  })
  return totalApr
}

import { useQuery } from "@tanstack/react-query"
import { Address } from "wagmi"

import { getVaultAprFallback } from "@/lib/api/vaults"
import { useActiveChainId } from "@/hooks"

export default function useCurveVaultMainnetTotalApr({
  asset,
  enabled,
}: {
  asset: Address
  enabled: boolean
}) {
  const breakdownApr = useCurveVaultMainnetBreakdownApr({ asset, enabled })
  return {
    ...breakdownApr,
    data: breakdownApr.data?.totalApr,
  }
}

export function useCurveVaultMainnetBreakdownApr({
  asset,
  enabled,
}: {
  asset: Address
  enabled: boolean
}) {
  const chainId = useActiveChainId()
  const vaultAprFallback = useQuery([chainId, asset, "vaultAprFallback"], {
    queryFn: () => getVaultAprFallback(asset),
    retry: false,
    enabled,
    keepPreviousData: enabled,
    refetchInterval: enabled ? 20000 : false,
    refetchIntervalInBackground: false,
  })
  return {
    ...vaultAprFallback,
    data: {
      baseApr: Number(vaultAprFallback.data?.[0]?.baseApr ?? 0),
      crvApr: Number(vaultAprFallback.data?.[0]?.crvApr ?? 0),
      cvxApr: Number(vaultAprFallback.data?.[0]?.cvxApr ?? 0),
      extraRewardsApr: Number(vaultAprFallback.data?.[0]?.extraRewardsApr ?? 0),
      totalApr:
        Number(vaultAprFallback.data?.[0]?.baseApr ?? 0) +
        Number(vaultAprFallback.data?.[0]?.crvApr ?? 0) +
        Number(vaultAprFallback.data?.[0]?.cvxApr ?? 0) +
        Number(vaultAprFallback.data?.[0]?.extraRewardsApr ?? 0),
    },
  }
}

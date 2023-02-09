import { useQuery } from "wagmi"

import { getVaultAprFallback } from "@/lib/aprFallback"
import { VaultDynamicProps } from "@/lib/types"
import useActiveChainId from "@/hooks/useActiveChainId"

export default function useCurveVaultGraphTotalApr({
  asset,
  enabled,
}: {
  asset: VaultDynamicProps["asset"]
  enabled: boolean
}) {
  const chainId = useActiveChainId()
  const vaultAprFallback = useQuery([chainId, asset, "vaultAprFallback"], {
    queryFn: () => getVaultAprFallback(asset),
    retry: false,
    enabled: enabled,
  })
  return {
    ...vaultAprFallback,
    data:
      Number(vaultAprFallback.data?.[0].baseApr) +
      Number(vaultAprFallback.data?.[0].crvApr) +
      Number(vaultAprFallback.data?.[0].cvxApr) +
      Number(vaultAprFallback.data?.[0].extraRewardsApr),
  }
}

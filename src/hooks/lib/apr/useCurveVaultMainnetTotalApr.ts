import { useQuery } from "@tanstack/react-query"

import { getVaultAprFallback } from "@/lib/api/vaults"
import { VaultDynamicProps } from "@/lib/types"
import { useActiveChainId } from "@/hooks"

export default function useCurveVaultMainnetTotalApr({
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
      Number(vaultAprFallback.data?.[0]?.baseApr ?? 0) +
      Number(vaultAprFallback.data?.[0]?.crvApr ?? 0) +
      Number(vaultAprFallback.data?.[0]?.cvxApr ?? 0) +
      Number(vaultAprFallback.data?.[0]?.extraRewardsApr ?? 0),
  }
}

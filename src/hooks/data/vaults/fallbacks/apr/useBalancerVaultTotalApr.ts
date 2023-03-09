import { VaultDynamicProps } from "@/lib/types"
import useBalancerVaultArbitrumTotalApr from "@/hooks/data/vaults/fallbacks/apr/useBalancerVaultArbitrumTotalApr"
import useBalancerVaultMainnetTotalApr from "@/hooks/data/vaults/fallbacks/apr/useBalancerVaultMainnetTotalApr"
import useActiveChainId from "@/hooks/useActiveChainId"

export default function useBalancerVaultTotalApr({
  asset,
  enabled,
}: {
  asset: VaultDynamicProps["asset"]
  enabled: boolean
}) {
  const chainId = useActiveChainId()
  const isArbitrumFamily = chainId === 313371 || chainId === 42161
  const balancerVaultMainnetTotalApr = useBalancerVaultMainnetTotalApr({
    asset,
    enabled: enabled && !isArbitrumFamily,
  })

  const balancerVaultArbitrumTotalApr = useBalancerVaultArbitrumTotalApr({
    asset,
    enabled: enabled && isArbitrumFamily,
  })

  const compoundPeriod = 84_600 // 1 day
  const yearInSecond = 31_556_926
  const n = yearInSecond / compoundPeriod

  if (!isArbitrumFamily) {
    const totalApr = balancerVaultMainnetTotalApr.data ?? 0
    const apy = (1 + totalApr / n) ** n - 1
    return {
      ...balancerVaultMainnetTotalApr,
      data: apy,
    }
  }
  return balancerVaultArbitrumTotalApr
}

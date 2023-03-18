import { VaultDynamicProps } from "@/lib/types"
import useBalancerVaultArbitrumTotalApr from "@/hooks/lib/apr/useBalancerVaultArbitrumTotalApr"
import useBalancerVaultMainnetTotalApr from "@/hooks/lib/apr/useBalancerVaultMainnetTotalApr"
import { useActiveChainId } from "@/hooks"

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

  const compoundPeriod = 84_600 * 7 // 7 days - 1 week
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

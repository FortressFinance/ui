import { convertToApy } from "@/lib/api/vaults/convertToApy"
import { VaultDynamicProps } from "@/lib/types"
import { useActiveChainId } from "@/hooks"
import useBalancerVaultArbitrumTotalApr from "@/hooks/lib/apr/compounder/useBalancerVaultArbitrumTotalApr"
import useBalancerVaultMainnetTotalApr from "@/hooks/lib/apr/compounder/useBalancerVaultMainnetTotalApr"

export default function useBalancerVaultTotalApy({
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

  if (!isArbitrumFamily) {
    return {
      ...balancerVaultMainnetTotalApr,
      data: convertToApy(balancerVaultMainnetTotalApr.data),
    }
  }
  return {
    ...balancerVaultArbitrumTotalApr,
    data: convertToApy(balancerVaultArbitrumTotalApr.data),
  }
}

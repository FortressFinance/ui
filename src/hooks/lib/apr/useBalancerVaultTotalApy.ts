import { Address } from "wagmi"

import { convertToApy } from "@/lib/api/vaults/convertToApy"
import { useActiveChainId } from "@/hooks"
import useBalancerVaultArbitrumTotalApr from "@/hooks/lib/apr/useBalancerVaultArbitrumTotalApr"
import useBalancerVaultMainnetTotalApr from "@/hooks/lib/apr/useBalancerVaultMainnetTotalApr"

export default function useBalancerVaultTotalApy({
  asset,
  enabled,
}: {
  asset: Address
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

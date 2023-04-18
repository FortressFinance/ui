import { Address } from "wagmi"

import { convertToApy } from "@/lib/api/vaults/convertToApy"
import { useActiveChainId } from "@/hooks"
import { useBalancerVaultArbitrumBreakdownApr } from "@/hooks/lib/apr/useBalancerVaultArbitrumTotalApr"
import { useBalancerVaultMainnetBreakdownApr } from "@/hooks/lib/apr/useBalancerVaultMainnetTotalApr"

export default function useBalancerVaultTotalApy({
  asset,
  enabled,
}: {
  asset: Address
  enabled: boolean
}) {
  const balancerVaultBreakdownApr = useBalancerVaultBreakdownApr({
    asset,
    enabled,
  })
  return {
    ...balancerVaultBreakdownApr,
    data: convertToApy(balancerVaultBreakdownApr.data?.totalApr),
  }
}

export function useBalancerVaultBreakdownApr({
  asset,
  enabled,
}: {
  asset: Address
  enabled: boolean
}) {
  const chainId = useActiveChainId()
  const isArbitrumFamily = chainId === 313371 || chainId === 42161
  const balancerVaultMainnetBreakdownApr = useBalancerVaultMainnetBreakdownApr({
    asset,
    enabled: enabled && !isArbitrumFamily,
  })

  const balancerVaultArbitrumBreakdownApr =
    useBalancerVaultArbitrumBreakdownApr({
      asset,
      enabled: enabled && isArbitrumFamily,
    })

  if (!isArbitrumFamily) {
    return balancerVaultMainnetBreakdownApr
  }
  return balancerVaultArbitrumBreakdownApr
}

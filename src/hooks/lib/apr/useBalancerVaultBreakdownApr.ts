import { Address } from "wagmi"

import { useActiveChainId } from "@/hooks"
import { useBalancerVaultArbitrumBreakdownApr } from "@/hooks/lib/apr/useBalancerVaultArbitrumTotalApr"
import { useBalancerVaultMainnetBreakdownApr } from "@/hooks/lib/apr/useBalancerVaultMainnetTotalApr"

export default function useBalancerVaultBreakdownApr({
  asset,
  enabled,
}: {
  asset: Address
  enabled: boolean
}) {
  const chainId = useActiveChainId()
  const isArbitrumFamily =
    chainId === 313371 || chainId === 42161 || chainId === 1337
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

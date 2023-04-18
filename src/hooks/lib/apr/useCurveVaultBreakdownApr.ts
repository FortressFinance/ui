import { Address } from "wagmi"

import { useActiveChainId } from "@/hooks"
import { useCurveVaultArbitrumBreakdownApr } from "@/hooks/lib/apr/useCurveVaultArbitrumTotalApr"
import { useCurveVaultMainnetBreakdownApr } from "@/hooks/lib/apr/useCurveVaultMainnetTotalApr"

export default function useCurveVaultBreakdownApr({
  asset,
  enabled,
}: {
  asset: Address
  enabled: boolean
}) {
  const chainId = useActiveChainId()
  const isArbitrumFamily = chainId === 313371 || chainId === 42161
  const curveVaultMainnetTotalApr = useCurveVaultMainnetBreakdownApr({
    asset,
    enabled: enabled && !isArbitrumFamily,
  })

  const curveVaultArbitrumTotalApr = useCurveVaultArbitrumBreakdownApr({
    asset,
    enabled: enabled && isArbitrumFamily,
  })

  if (!isArbitrumFamily) {
    return curveVaultMainnetTotalApr
  }

  return curveVaultArbitrumTotalApr
}

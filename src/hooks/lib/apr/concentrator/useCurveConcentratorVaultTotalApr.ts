import { Address } from "wagmi"

import useCurveVaultArbitrumTotalApr from "@/hooks/lib/apr/useCurveVaultArbitrumTotalApr"
import useCurveVaultMainnetTotalApr from "@/hooks/lib/apr/useCurveVaultMainnetTotalApr"
import { useActiveChainId } from "@/hooks/useActiveChainId"

export default function useCurveConcentratorVaultTotalApr({
  asset,
  enabled,
}: {
  asset: Address
  enabled: boolean
}) {
  const chainId = useActiveChainId()
  const isArbitrumFamily = chainId === 313371 || chainId === 42161
  const curveVaultMainnetTotalApr = useCurveVaultMainnetTotalApr({
    asset,
    enabled: enabled && !isArbitrumFamily,
  })

  const curveVaultArbitrumTotalApr = useCurveVaultArbitrumTotalApr({
    asset,
    enabled: enabled && isArbitrumFamily,
  })

  if (!isArbitrumFamily) {
    return curveVaultMainnetTotalApr
  }
  return curveVaultArbitrumTotalApr
}

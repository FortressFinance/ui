import { Address } from "wagmi"

import { convertToApy } from "@/lib/api/vaults/convertToApy"
import { useActiveChainId } from "@/hooks"
import useCurveVaultArbitrumTotalApr, {
  useCurveVaultArbitrumBreakdownApr,
} from "@/hooks/lib/apr/useCurveVaultArbitrumTotalApr"
import useCurveVaultMainnetTotalApr, {
  useCurveVaultMainnetBreakdownApr,
} from "@/hooks/lib/apr/useCurveVaultMainnetTotalApr"

export default function useCurveVaultTotalApy({
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
    return {
      ...curveVaultMainnetTotalApr,
      data: convertToApy(curveVaultMainnetTotalApr.data),
    }
  }

  return {
    ...curveVaultArbitrumTotalApr,
    data: convertToApy(curveVaultArbitrumTotalApr.data),
  }
}

export function useCurveVaultBreakdownApr({
  asset,
  enabled,
}: {
  asset: Address
  enabled: boolean
}) {
  const chainId = useActiveChainId()
  const isArbitrumFamily = chainId === 313371 || chainId === 42161
  const curveVaultMainnetBreakdownApr = useCurveVaultMainnetBreakdownApr({
    asset,
    enabled: enabled && !isArbitrumFamily,
  })

  const curveVaultArbitrumBreakdownApr = useCurveVaultArbitrumBreakdownApr({
    asset,
    enabled: enabled && isArbitrumFamily,
  })

  if (!isArbitrumFamily) {
    return curveVaultMainnetBreakdownApr
  }

  return curveVaultArbitrumBreakdownApr
}

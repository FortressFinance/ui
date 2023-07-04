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
  const apr = useCurveVaultTotalApr({ asset, enabled })

  return {
    ...apr,
    data: convertToApy(apr.data),
  }
}

export function useCurveVaultTotalApr({
  asset,
  enabled,
}: {
  asset: Address
  enabled: boolean
}) {
  const chainId = useActiveChainId()
  const isArbitrumFamily =
    chainId === 313371 || chainId === 42161 || chainId === 1337
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

export function useCurveVaultBreakdownApr({
  asset,
  enabled,
}: {
  asset: Address
  enabled: boolean
}) {
  const chainId = useActiveChainId()
  const isArbitrumFamily =
    chainId === 313371 || chainId === 42161 || chainId === 31337
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

  return {
    ...curveVaultArbitrumBreakdownApr,
    data: {
      baseApr: curveVaultArbitrumBreakdownApr.data?.baseApr,
      crvApr: curveVaultArbitrumBreakdownApr.data?.crvApr,
      cvxApr: curveVaultArbitrumBreakdownApr.data?.cvxApr,
      totalApr: curveVaultArbitrumBreakdownApr.data?.totalApr,
    },
  }
}

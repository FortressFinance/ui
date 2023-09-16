import { Address } from "wagmi"

import { convertToApy } from "@/lib/api/vaults/convertToApy"
import { useConcentratorTokenVaultTotalApr } from "@/hooks/lib/apr/concentrator/useConcentratorTokenVaultTotalApy"
import { useBalancerVaultTotalApr } from "@/hooks/lib/apr/useBalancerVaultTotalApy"
import { useCurveVaultTotalApr } from "@/hooks/lib/apr/useCurveVaultTotalApy"
import {
  useShouldUseCurveFallback,
  useShouldUseTokenFallback,
} from "@/hooks/useVaultTypes"

export function useConcentratorApy({ targetAsset }: { targetAsset: Address }) {
  const fallbackApr = useConcentratorFallbackApr({ targetAsset })

  if (targetAsset === "0x") {
    return {
      isLoading: false,
      data: 0,
    }
  }

  return {
    ...fallbackApr,
    data: convertToApy(fallbackApr.data),
  }
}

export function useConcentratorFallbackApr({
  targetAsset,
}: {
  targetAsset: Address
}) {
  const isCurve = useShouldUseCurveFallback(targetAsset)
  const isToken = useShouldUseTokenFallback(targetAsset)

  const isCurveFallbackEnabled = isCurve && !isToken
  const isBalancerFallbackEnabled = !isCurve && !isToken
  const isTokenFallbackEnabled = isToken

  const curveVaultTotalApr = useCurveVaultTotalApr({
    asset: targetAsset,
    enabled: isCurveFallbackEnabled ?? false,
  })
  const balancerVaultTotalApr = useBalancerVaultTotalApr({
    asset: targetAsset,
    enabled: isBalancerFallbackEnabled ?? false,
  })
  const tokenVaultTotalApr = useConcentratorTokenVaultTotalApr({
    asset: targetAsset,
    enabled: isTokenFallbackEnabled ?? false,
  })

  if (targetAsset === "0x") {
    return {
      isLoading: false,
      data: 0,
    }
  }

  if (isCurveFallbackEnabled) {
    return curveVaultTotalApr
  }

  if (isBalancerFallbackEnabled) {
    return balancerVaultTotalApr
  }

  return tokenVaultTotalApr
}

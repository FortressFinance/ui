import { Address } from "wagmi"

import useConcentratorTokenVaultBreakdownApr from "@/hooks/lib/apr/concentrator/useConcentratorTokenVaultBreakdownApr"
import useBalancerVaultBreakdownApr from "@/hooks/lib/apr/useBalancerVaultBreakdownApr"
import useCurveVaultBreakdownApr from "@/hooks/lib/apr/useCurveVaultBreakdownApr"
import {
  useShouldUseCurveFallback,
  useShouldUseTokenFallback,
} from "@/hooks/useVaultTypes"

export function useConcentratorBreakdownApy({
  targetAsset,
}: {
  targetAsset: Address
}) {
  const shouldCurveFallback = useShouldUseCurveFallback(targetAsset)
  const shouldTokenFallback = useShouldUseTokenFallback(targetAsset)

  const isCurveFallbackEnabled = shouldCurveFallback && !shouldTokenFallback
  const isBalancerFallbackEnabled = !shouldCurveFallback && !shouldTokenFallback
  const isTokenFallbackEnabled = shouldTokenFallback

  const curveVaultBreakdownApy = useCurveVaultBreakdownApr({
    asset: targetAsset,
    enabled: isCurveFallbackEnabled ?? false,
  })
  const balancerVaultBreakdownApy = useBalancerVaultBreakdownApr({
    asset: targetAsset,
    enabled: isBalancerFallbackEnabled ?? false,
  })
  const tokenVaultBreakdownApy = useConcentratorTokenVaultBreakdownApr({
    asset: targetAsset,
    enabled: isTokenFallbackEnabled ?? false,
  })

  if (targetAsset === "0x") {
    return {
      isLoading: false,
      data: {
        totalApr: 0,
      },
    }
  }

  if (isCurveFallbackEnabled) {
    return curveVaultBreakdownApy
  }

  if (isBalancerFallbackEnabled) {
    return balancerVaultBreakdownApy
  }
  return tokenVaultBreakdownApy
}

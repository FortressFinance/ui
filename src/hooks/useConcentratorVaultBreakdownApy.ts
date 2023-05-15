import { VaultProps } from "@/lib/types"
import { useConcentratorTokenVaultBreakdownApr } from "@/hooks/lib/apr/concentrator/useConcentratorTokenVaultTotalApy"
import { useBalancerVaultBreakdownApr } from "@/hooks/lib/apr/useBalancerVaultTotalApy"
import { useCurveVaultBreakdownApr } from "@/hooks/lib/apr/useCurveVaultTotalApy"
import {
  useShouldUseCurveFallback,
  useShouldUseTokenFallback,
} from "@/hooks/useVaultTypes"

export function useConcentratorVaultBreakdownApy({
  vaultAddress: primaryAsset,
}: VaultProps) {
  const shouldCurveFallback = useShouldUseCurveFallback(primaryAsset)
  const shouldTokenFallback = useShouldUseTokenFallback(primaryAsset)

  const isCurveFallbackEnabled = shouldCurveFallback && !shouldTokenFallback
  const isBalancerFallbackEnabled = !shouldCurveFallback && !shouldTokenFallback

  const curveVaultBreakdownApr = useCurveVaultBreakdownApr({
    asset: primaryAsset,
    enabled: isCurveFallbackEnabled ?? false,
  })
  const balancerVaultBreakdownApr = useBalancerVaultBreakdownApr({
    asset: primaryAsset,
    enabled: isBalancerFallbackEnabled ?? false,
  })
  const tokenVaultBreakdownApr = useConcentratorTokenVaultBreakdownApr({
    asset: primaryAsset,
    enabled: !!shouldTokenFallback,
  })

  if (primaryAsset === "0x") {
    return {
      isLoading: false,
      data: {
        totalApr: 0,
      },
    }
  }

  if (isCurveFallbackEnabled) {
    return curveVaultBreakdownApr
  }

  if (isBalancerFallbackEnabled) {
    return balancerVaultBreakdownApr
  }

  return tokenVaultBreakdownApr
}

import { useApiConcentratorDynamic } from "@/hooks/lib/api/useApiConcentratorDynamic"
import useConcentratorTokenVaultBreakdownApr from "@/hooks/lib/apr/concentrator/useConcentratorTokenVaultBreakdownApr"
import useBalancerVaultBreakdownApr from "@/hooks/lib/apr/useBalancerVaultBreakdownApr"
import useCurveVaultBreakdownApr from "@/hooks/lib/apr/useCurveVaultBreakdownApr"
import { ConcentratorApyProps } from "@/hooks/useConcentratorApy"
import { useConcentratorId } from "@/hooks/useConcentratorId"
import { useConcentratorTargetAssetId } from "@/hooks/useConcentratorTargetAssetId"
import {
  useShouldUseCurveFallback,
  useShouldUseTokenFallback,
} from "@/hooks/useVaultTypes"

export function useConcentratorBreakdownApy({
  targetAsset,
  primaryAsset,
  type,
}: ConcentratorApyProps) {
  const shouldCurveFallback = useShouldUseCurveFallback(targetAsset)
  const shouldTokenFallback = useShouldUseTokenFallback(targetAsset)
  const { data: targetAssetId, isLoading: targetAssetIdIsLoading } =
    useConcentratorTargetAssetId({ targetAsset, enabled: true })
  const { data: concentratorId, isLoading: concentratorIdIsLoading } =
    useConcentratorId({
      targetAsset,
      primaryAsset,
      enabled: true,
    })

  const apiQuery = useApiConcentratorDynamic({
    targetAssetId,
    concentratorId,
    type,
  })

  const isCurveFallbackEnabled =
    apiQuery.isError && shouldCurveFallback && !shouldTokenFallback
  const isBalancerFallbackEnabled =
    apiQuery.isError && !shouldCurveFallback && !shouldTokenFallback
  const isTokenFallbackEnabled = apiQuery.isError && shouldTokenFallback

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

  if (isTokenFallbackEnabled) {
    return tokenVaultBreakdownApy
  }

  return {
    ...apiQuery,
    isLoading:
      targetAssetIdIsLoading || concentratorIdIsLoading || apiQuery.isLoading,
    data: apiQuery.data?.APY.compounderAPR_breakdown,
  }
}

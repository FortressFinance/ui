import { VaultProps } from "@/lib/types"
import { useApiConcentratorDynamic } from "@/hooks/lib/api/useApiConcentratorDynamic"
import { useConcentratorTokenVaultBreakdownApr } from "@/hooks/lib/apr/concentrator/useConcentratorTokenVaultTotalApy"
import { useBalancerVaultBreakdownApr } from "@/hooks/lib/apr/useBalancerVaultTotalApy"
import { useCurveVaultBreakdownApr } from "@/hooks/lib/apr/useCurveVaultTotalApy"
import { useConcentratorId } from "@/hooks/useConcentratorId"
import { useConcentratorTargetAssetId } from "@/hooks/useConcentratorTargetAssetId"
import {
  useIsConcentratorCurveVault,
  useIsConcentratorTokenVault,
} from "@/hooks/useVaultTypes"

export function useConcentratorVaultBreakdownApy({
  asset: targetAsset,
  vaultAddress: primaryAsset,
  type,
}: VaultProps) {
  const isCurve = useIsConcentratorCurveVault(primaryAsset)
  const isToken = useIsConcentratorTokenVault(primaryAsset)

  const { data: targetAssetId, isLoading: targetAssetIdIsLoading } =
    useConcentratorTargetAssetId({ targetAsset })
  const { data: concentratorId, isLoading: concentratorIdIsLoading } =
    useConcentratorId({
      primaryAsset,
      targetAsset,
    })

  const apiQuery = useApiConcentratorDynamic({
    targetAssetId,
    concentratorId,
    type,
  })

  const isCurveFallbackEnabled = apiQuery.isError && isCurve && !isToken
  const isBalancerFallbackEnabled = apiQuery.isError && !isCurve && !isToken
  const isTokenFallbackEnabled = apiQuery.isError && isToken

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
    enabled: isTokenFallbackEnabled ?? false,
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

  if (isTokenFallbackEnabled) {
    return tokenVaultBreakdownApr
  }

  return {
    ...apiQuery,
    isLoading:
      targetAssetIdIsLoading || concentratorIdIsLoading || apiQuery.isLoading,
    data: apiQuery.data?.APY.concentrator_APR_breakdown,
  }
}

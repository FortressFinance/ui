import { ConcentratorVaultProps } from "@/lib/types"
import { useApiConcentratorDynamic } from "@/hooks/lib/api/useApiConcentratorDynamic"
import useConcentratorTokenVaultTotalApy from "@/hooks/lib/apr/concentrator/useConcentratorTokenVaultTotalApy"
import useBalancerVaultTotalApy from "@/hooks/lib/apr/useBalancerVaultTotalApy"
import useCurveVaultTotalApy from "@/hooks/lib/apr/useCurveVaultTotalApy"
import { useConcentratorId } from "@/hooks/useConcentratorId"
import { useConcentratorTargetAssetId } from "@/hooks/useConcentratorTargetAssetId"
import {
  useIsConcentratorCurveVault,
  useIsConcentratorTokenVault,
} from "@/hooks/useVaultTypes"

export function useConcentratorVaultApy({
  primaryAsset,
  targetAsset,
  type,
}: ConcentratorVaultProps) {
  const isCurve = useIsConcentratorCurveVault(targetAsset)
  const isToken = useIsConcentratorTokenVault(targetAsset)

  const { data: targetAssetId, isLoading: targetAssetIdIsLoading } =
    useConcentratorTargetAssetId({ targetAsset })
  const { data: concentratorId, isLoading: concentratorIdIsLoading } =
    useConcentratorId({
      primaryAsset,
      targetAsset,
      type,
    })

  const apiQuery = useApiConcentratorDynamic({
    targetAssetId,
    concentratorId,
    type,
  })

  const isCurveFallbackEnabled = apiQuery.isError && isCurve && !isToken
  const isBalancerFallbackEnabled = apiQuery.isError && !isCurve && !isToken
  const isTokenFallbackEnabled = apiQuery.isError && isToken

  const curveVaultTotalApy = useCurveVaultTotalApy({
    asset: targetAsset,
    enabled: isCurveFallbackEnabled ?? false,
  })
  const balancerVaultTotalApy = useBalancerVaultTotalApy({
    asset: targetAsset,
    enabled: isBalancerFallbackEnabled ?? false,
  })
  const tokenVaultTotalApy = useConcentratorTokenVaultTotalApy({
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
    return curveVaultTotalApy
  }

  if (isBalancerFallbackEnabled) {
    return balancerVaultTotalApy
  }

  if (isTokenFallbackEnabled) {
    return tokenVaultTotalApy
  }

  return {
    ...apiQuery,
    isLoading:
      targetAssetIdIsLoading || concentratorIdIsLoading || apiQuery.isLoading,
    data: apiQuery.data?.APY.compounderAPY,
  }
}

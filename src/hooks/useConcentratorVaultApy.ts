import { concentratorConvertToApy } from "@/lib/api/vaults/convertToApy"
import { VaultProps } from "@/lib/types"
import { useApiConcentratorDynamic } from "@/hooks/lib/api/useApiConcentratorDynamic"
import useConcentratorTokenVaultTotalApy from "@/hooks/lib/apr/concentrator/useConcentratorTokenVaultTotalApy"
import useBalancerVaultTotalApy from "@/hooks/lib/apr/useBalancerVaultTotalApy"
import useCurveVaultTotalApy from "@/hooks/lib/apr/useCurveVaultTotalApy"
import { useConcentratorApy } from "@/hooks/useConcentratorApy"
import { useConcentratorId } from "@/hooks/useConcentratorId"
import { useConcentratorTargetAssetId } from "@/hooks/useConcentratorTargetAssetId"
import {
  useIsConcentratorCurveVault,
  useIsConcentratorTokenVault,
} from "@/hooks/useVaultTypes"

export function useConcentratorVaultApy({
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

  const compounderApy = useConcentratorApy({ targetAsset, primaryAsset, type })

  const apiQuery = useApiConcentratorDynamic({
    targetAssetId,
    concentratorId,
    type,
  })

  const isCurveFallbackEnabled = apiQuery.isError && isCurve && !isToken
  const isBalancerFallbackEnabled = apiQuery.isError && !isCurve && !isToken
  const isTokenFallbackEnabled = apiQuery.isError && isToken

  const concentratorCurveVaultTotalApy = useCurveVaultTotalApy({
    asset: primaryAsset,
    enabled: isCurveFallbackEnabled ?? false,
  })
  const concentratorBalancerVaultTotalApy = useBalancerVaultTotalApy({
    asset: primaryAsset,
    enabled: isBalancerFallbackEnabled ?? false,
  })
  const concentratorTokenVaultTotalApy = useConcentratorTokenVaultTotalApy({
    asset: primaryAsset,
    enabled: isTokenFallbackEnabled ?? false,
  })

  if (primaryAsset === "0x") {
    return {
      isLoading: false,
      data: 0,
    }
  }

  if (isCurveFallbackEnabled) {
    return {
      ...concentratorCurveVaultTotalApy,
      data: concentratorConvertToApy(
        concentratorCurveVaultTotalApy.data,
        compounderApy.data
      ),
    }
  }

  if (isBalancerFallbackEnabled) {
    return {
      ...concentratorBalancerVaultTotalApy,
      data: concentratorConvertToApy(
        concentratorBalancerVaultTotalApy.data,
        compounderApy.data
      ),
    }
  }

  if (isTokenFallbackEnabled) {
    return {
      ...concentratorTokenVaultTotalApy,
      data: concentratorConvertToApy(
        concentratorTokenVaultTotalApy.data,
        compounderApy.data
      ),
    }
  }

  return {
    ...apiQuery,
    isLoading:
      targetAssetIdIsLoading || concentratorIdIsLoading || apiQuery.isLoading,
    data: apiQuery.data?.APY.totalAPY,
  }
}

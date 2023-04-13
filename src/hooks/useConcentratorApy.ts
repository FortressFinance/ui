import { Address } from "wagmi"

import { VaultType } from "@/lib/types"
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

type ConcentratorApyProps = {
  targetAsset: Address
  primaryAsset: Address
  type: VaultType
}

export function useConcentratorApy({
  targetAsset,
  primaryAsset,
  type,
}: ConcentratorApyProps) {
  const isCurve = useIsConcentratorCurveVault(primaryAsset)
  const isToken = useIsConcentratorTokenVault(primaryAsset)
  const { data: targetAssetId, isLoading: targetAssetIdIsLoading } =
    useConcentratorTargetAssetId({ targetAsset })
  const { data: concentratorId, isLoading: concentratorIdIsLoading } =
    useConcentratorId({
      targetAsset,
      primaryAsset,
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
    asset: primaryAsset,
    enabled: isCurveFallbackEnabled ?? false,
  })
  const balancerVaultTotalApy = useBalancerVaultTotalApy({
    asset: primaryAsset,
    enabled: isBalancerFallbackEnabled ?? false,
  })
  const tokenVaultTotalApy = useConcentratorTokenVaultTotalApy({
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
    data: apiQuery.data?.APY.concentrator_APR,
  }
}

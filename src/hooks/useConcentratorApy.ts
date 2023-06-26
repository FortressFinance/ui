import { Address } from "wagmi"

import { convertToApy } from "@/lib/api/vaults/convertToApy"
import { VaultType } from "@/lib/types"
import { useApiConcentratorDynamic } from "@/hooks/lib/api/useApiConcentratorDynamic"
import { useConcentratorTokenVaultTotalApr } from "@/hooks/lib/apr/concentrator/useConcentratorTokenVaultTotalApy"
import { useBalancerVaultTotalApr } from "@/hooks/lib/apr/useBalancerVaultTotalApy"
import { useCurveVaultTotalApr } from "@/hooks/lib/apr/useCurveVaultTotalApy"
import { useConcentratorId } from "@/hooks/useConcentratorId"
import { useConcentratorTargetAssetId } from "@/hooks/useConcentratorTargetAssetId"
import {
  useShouldUseCurveFallback,
  useShouldUseTokenFallback,
} from "@/hooks/useVaultTypes"

export type ConcentratorApyProps = {
  targetAsset: Address
  primaryAsset: Address
  type: VaultType
}

export function useConcentratorApy({
  targetAsset,
  primaryAsset,
  type,
}: ConcentratorApyProps) {
  const shouldCurveFallback = useShouldUseCurveFallback(targetAsset)
  const shouldTokenFallback = useShouldUseTokenFallback(targetAsset)
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

  const isCurveFallbackEnabled =
    (apiQuery.isError || (apiQuery.data?.APY.compounderAPY ?? 0) === 0) &&
    shouldCurveFallback &&
    !shouldTokenFallback
  const isBalancerFallbackEnabled =
    (apiQuery.isError || (apiQuery.data?.APY.compounderAPY ?? 0) === 0) &&
    !shouldCurveFallback &&
    !shouldTokenFallback
  const isTokenFallbackEnabled =
    (apiQuery.isError || (apiQuery.data?.APY.compounderAPY ?? 0) === 0) &&
    shouldTokenFallback

  const fallbackApr = useConcentratorFallbackApr({ targetAsset })

  if (targetAsset === "0x") {
    return {
      isLoading: false,
      data: 0,
    }
  }

  if (
    isCurveFallbackEnabled ||
    isBalancerFallbackEnabled ||
    isTokenFallbackEnabled
  ) {
    return {
      ...fallbackApr,
      data: convertToApy(fallbackApr.data),
    }
  }

  return {
    ...apiQuery,
    isLoading:
      targetAssetIdIsLoading || concentratorIdIsLoading || apiQuery.isLoading,
    data: apiQuery.data?.APY.compounderAPY,
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

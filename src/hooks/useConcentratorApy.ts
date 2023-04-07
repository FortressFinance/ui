import { Address } from "wagmi"

import { VaultType } from "@/lib/types"
import { useApiConcentratorDynamic } from "@/hooks/lib/api/useApiConcentratorDynamic"
import useConcentratorTokenVaultTotalApy from "@/hooks/lib/apr/concentrator/useConcentratorTokenVaultTotalApy"
import useBalancerVaultTotalApy from "@/hooks/lib/apr/useBalancerVaultTotalApy"
import useCurveVaultTotalApy from "@/hooks/lib/apr/useCurveVaultTotalApy"
import { useConcentratorId } from "@/hooks/useConcentratorId"
import { useConcentratorTargetAssetId } from "@/hooks/useConcentratorTargetAssetId"

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
  //const isCurve = useIsCurveVault(type)
  //const isToken = useIsTokenVault(type)
  const { data: targetAssetId, isLoading: targetAssetIdIsLoading } =
    useConcentratorTargetAssetId({ targetAsset })
  const { data: concentratorId, isLoading: concentratorIdIsLoading } =
    useConcentratorId({
      targetAsset,
      primaryAsset,
      type,
    })

  const apiQuery = useApiConcentratorDynamic({
    targetAssetId,
    concentratorId,
    type,
  })

  const isCurveFallbackEnabled = apiQuery.isError
  const isBalancerFallbackEnabled = apiQuery.isError
  const isTokenFallbackEnabled = apiQuery.isError

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

  // to do so, because we don't have notion about token/curve and balancer in concentrator
  // at least atm
  if (
    isCurveFallbackEnabled ||
    isBalancerFallbackEnabled ||
    isTokenFallbackEnabled
  ) {
    const fallbackReturns = [
      curveVaultTotalApy.data,
      balancerVaultTotalApy.data,
      tokenVaultTotalApy.data,
    ]
    return {
      ...curveVaultTotalApy,
      isLoading:
        curveVaultTotalApy.isLoading ||
        balancerVaultTotalApy.isLoading ||
        tokenVaultTotalApy.isLoading,
      data: Math.max(...fallbackReturns),
    }
  }

  return {
    ...apiQuery,
    isLoading:
      targetAssetIdIsLoading || concentratorIdIsLoading || apiQuery.isLoading,
    data: apiQuery.data?.APY.concentrator_APR,
  }
}

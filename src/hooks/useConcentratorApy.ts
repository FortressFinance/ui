import { Address } from "wagmi"

import { VaultType } from "@/lib/types"
import { useApiConcentratorDynamic } from "@/hooks/lib/api/useApiConcentratorDynamic"
import useBalancerConcentratorVaultTotalApr from "@/hooks/lib/apr/concentrator/useBalancerConcentratorVaultTotalApr"
import useCurveConcentratorVaultTotalApr from "@/hooks/lib/apr/concentrator/useCurveConcentratorVaultTotalApr"
import { useConcentratorId } from "@/hooks/useConcentratorId"
import { useConcentratorTargetAssetId } from "@/hooks/useConcentratorTargetAssetId"
import { useIsCurveVault } from "@/hooks/useVaultTypes"

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
  const isCurve = useIsCurveVault(type)
  const { data: targetAssetId } = useConcentratorTargetAssetId({ targetAsset })
  const { data: concentratorId } = useConcentratorId({
    targetAsset,
    primaryAsset,
    type,
  })

  const apiQuery = useApiConcentratorDynamic({
    targetAssetId,
    concentratorId,
    type,
  })

  const isEnabledCurveVaultTotalApy = apiQuery.isError && (isCurve ?? false)
  const isEnabledBalancerVaultTotalApy = apiQuery.isError && (!isCurve ?? false)

  const curveVaultTotalApy = useCurveConcentratorVaultTotalApr({
    asset: primaryAsset,
    enabled: isEnabledCurveVaultTotalApy,
  })
  const balancerVaultTotalApy =
    useBalancerConcentratorVaultTotalApr(/*{
    asset,
    enabled: !isCurve ?? false,
  }*/)

  if (isEnabledCurveVaultTotalApy) {
    return curveVaultTotalApy
  }

  if (isEnabledBalancerVaultTotalApy) {
    return balancerVaultTotalApy
  }

  return {
    ...apiQuery,
    data: apiQuery.data?.APY.concentrator_APR,
  }
}

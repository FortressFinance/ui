import { Address } from "wagmi"

import { VaultType } from "@/lib/types"
import { useConcentratorId, useConcentratorTargetAssetId } from "@/hooks"
import { useApiConcentratorDynamic } from "@/hooks/lib/api/useApiConcentratorDynamic"
import useConcentratorAumFallback from "@/hooks/lib/tvl/concentrator/useConcentratorAumFallback"

type ConcentratorAumProps = {
  targetAsset: Address
  primaryAsset: Address
  ybToken: Address
  type: VaultType
}

export function useConcentratorAum({
  targetAsset,
  primaryAsset,
  ybToken,
  type,
}: ConcentratorAumProps) {
  const { data: targetAssetId } = useConcentratorTargetAssetId({ targetAsset })
  const { data: concentratorId } = useConcentratorId({
    targetAsset,
    primaryAsset,
  })

  const apiQuery = useApiConcentratorDynamic({
    targetAssetId,
    concentratorId,
    type,
  })

  const aumFallback = useConcentratorAumFallback({
    asset: primaryAsset,
    ybToken,
    enabled: apiQuery.isError,
  })

  if (apiQuery.isError) {
    return aumFallback
  }

  return {
    ...apiQuery,
    data: Number(apiQuery.data?.TVL ?? 0),
  }
}

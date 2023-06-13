import { Address, useContractRead } from "wagmi"

import { useApiConcentratorTargetAssetId } from "@/hooks/lib/api/useApiConcentratorTargetAssetId"
import { useRegistryContract } from "@/hooks/lib/useRegistryContract"

type ConcentratorTargetAssetIdProps = {
  targetAsset: Address
  enabled?: boolean
}

export function useConcentratorTargetAssetId({
  targetAsset,
  enabled,
}: ConcentratorTargetAssetIdProps) {
  const apiQuery = useApiConcentratorTargetAssetId({
    targetAsset,
    enabled: targetAsset !== "0x" && enabled,
  })

  const targetAssets = useContractRead({
    ...useRegistryContract(),
    functionName: "concentratorTargetAssets",
    enabled: apiQuery.isError && targetAsset !== "0x" && enabled,
  })

  if (apiQuery.isError) {
    let relevantIndex = -1
    targetAssets.data?.map((curTargetAsset, index) => {
      if (
        !!targetAsset &&
        !!curTargetAsset &&
        targetAsset.toLocaleUpperCase() === curTargetAsset.toLocaleUpperCase()
      ) {
        relevantIndex = index
      }
    })
    return {
      ...targetAssets,
      data: relevantIndex,
    }
  }

  return apiQuery
}

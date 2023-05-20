import { Address, useContractRead } from "wagmi"

import { useApiConcentratorTargetAssetId } from "@/hooks/lib/api/useApiConcentratorTargetAssetId"
import { useRegistryContract } from "@/hooks/lib/useRegistryContract"

export function useConcentratorTargetAssetId({
  targetAsset,
}: {
  targetAsset: Address
}) {
  const apiQuery = useApiConcentratorTargetAssetId({
    targetAsset,
    enabled: true,
  })

  const targetAssets = useContractRead({
    ...useRegistryContract(),
    functionName: "concentratorTargetAssets",
    enabled: apiQuery.isError,
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

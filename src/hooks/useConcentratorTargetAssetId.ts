import { Address } from "wagmi"

import { useApiConcentratorTargetAssetId } from "@/hooks/lib/api/useApiConcentratorTargetAssetId"
import { useFallbackRead } from "@/hooks/lib/useFallbackRequest"
import { useRegistryContract } from "@/hooks/lib/useRegistryContract"

export function useConcentratorTargetAssetId({
  targetAsset,
}: {
  targetAsset: Address
}) {
  const apiQuery = useApiConcentratorTargetAssetId({ targetAsset })

  const targetAssets = useFallbackRead(
    {
      ...useRegistryContract(),
      functionName: "concentratorTargetAssets",
      enabled: apiQuery.isError,
    },
    []
  )

  if (apiQuery.isError) {
    let relevantIndex = -1
    targetAssets.data?.map((curTargetAsset, index) => {
      if (
        targetAsset !== undefined &&
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

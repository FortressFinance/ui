import { Address } from "wagmi"

import { useApiConcentratorId } from "@/hooks/lib/api/useApiConcentratorId"
import { useFallbackRead } from "@/hooks/lib/useFallbackRequest"
import { useRegistryContract } from "@/hooks/lib/useRegistryContract"
import { useIsConcentratorCurveVault } from "@/hooks/useVaultTypes"

export function useConcentratorId({
  targetAsset,
  primaryAsset,
}: {
  targetAsset: Address
  primaryAsset: Address
}) {
  const apiQuery = useApiConcentratorId({ targetAsset })

  const isCurve = useIsConcentratorCurveVault(targetAsset)
  const primaryAssets = useFallbackRead(
    {
      ...useRegistryContract(),
      functionName: "getConcentratorPrimaryAssets",
      args: [isCurve, targetAsset],
      enabled: apiQuery.isError,
    },
    []
  )

  if (apiQuery.isError) {
    let relevantIndex = -1
    primaryAssets.data?.map((curPrimaryAsset, index) => {
      if (
        primaryAsset.toLocaleUpperCase() === curPrimaryAsset.toLocaleUpperCase()
      ) {
        relevantIndex = index
      }
    })
    return {
      ...primaryAssets,
      data: relevantIndex,
    }
  }

  return apiQuery
}

import { Address } from "wagmi"

import { VaultType } from "@/lib/types"
import { useApiConcentratorId } from "@/hooks/lib/api/useApiConcentratorId"
import { useFallbackRead } from "@/hooks/lib/useFallbackRequest"
import { useRegistryContract } from "@/hooks/lib/useRegistryContract"
import { useIsCurveVault } from "@/hooks/useVaultTypes"

export function useConcentratorId({
  targetAsset,
  primaryAsset,
  type,
}: {
  targetAsset: Address
  primaryAsset: Address
  type: VaultType
}) {
  const apiQuery = useApiConcentratorId({ targetAsset })

  const isCurve = useIsCurveVault(type)
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

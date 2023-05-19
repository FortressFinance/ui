import { Address, useContractRead } from "wagmi"

import { useApiConcentratorId } from "@/hooks/lib/api/useApiConcentratorId"
import { useRegistryContract } from "@/hooks/lib/useRegistryContract"
import { useConcentratorFirstVaultType } from "@/hooks/useConcentratorFirstVaultType"

export function useConcentratorId({
  targetAsset,
  primaryAsset,
}: {
  targetAsset: Address
  primaryAsset: Address
}) {
  const apiQuery = useApiConcentratorId({ targetAsset, primaryAsset })
  const firstConcentratorVaultType = useConcentratorFirstVaultType({
    targetAsset,
  })

  const primaryAssets = useContractRead({
    ...useRegistryContract(),
    functionName: "getConcentratorPrimaryAssets",
    args: [firstConcentratorVaultType === "curve", targetAsset],
    enabled: apiQuery.isError,
  })

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

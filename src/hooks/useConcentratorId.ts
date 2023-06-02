import { Address, useContractRead } from "wagmi"

import { useApiConcentratorId } from "@/hooks/lib/api/useApiConcentratorId"
import { useRegistryContract } from "@/hooks/lib/useRegistryContract"
import { useConcentratorFirstVaultType } from "@/hooks/useConcentratorFirstVaultType"

type ConcentratorIdProps = {
  targetAsset: Address
  primaryAsset: Address
  enabled?: boolean
}

export function useConcentratorId({
  targetAsset,
  primaryAsset,
  enabled = true,
}: ConcentratorIdProps) {
  const apiQuery = useApiConcentratorId({
    targetAsset,
    primaryAsset,
    enabled,
  })
  const firstConcentratorVaultType = useConcentratorFirstVaultType({
    targetAsset,
    enabled,
  })

  const primaryAssets = useContractRead({
    ...useRegistryContract(),
    functionName: "getConcentratorPrimaryAssets",
    args: [firstConcentratorVaultType === "curve", targetAsset],
    enabled: apiQuery.isError && enabled,
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

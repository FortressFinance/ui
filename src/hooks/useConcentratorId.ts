import { Address, useContractRead } from "wagmi"

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
  enabled,
}: ConcentratorIdProps) {
  const firstConcentratorVaultType = useConcentratorFirstVaultType({
    targetAsset,
    enabled,
  })

  const primaryAssets = useContractRead({
    ...useRegistryContract(),
    functionName: "getConcentratorPrimaryAssets",
    args: [firstConcentratorVaultType === "curve", targetAsset],
    enabled: targetAsset !== "0x" && enabled,
  })

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

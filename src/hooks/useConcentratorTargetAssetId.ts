import { Address, useContractRead } from "wagmi"

import { useRegistryContract } from "@/hooks/lib/useRegistryContract"

type ConcentratorTargetAssetIdProps = {
  targetAsset: Address
  enabled?: boolean
}

export function useConcentratorTargetAssetId({
  targetAsset,
  enabled,
}: ConcentratorTargetAssetIdProps) {
  const targetAssets = useContractRead({
    ...useRegistryContract(),
    functionName: "concentratorTargetAssets",
    enabled: targetAsset !== "0x" && enabled,
  })

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

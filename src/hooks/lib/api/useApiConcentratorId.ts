import { Address } from "wagmi"

import { useApiConcentratorStaticData } from "@/hooks/lib/api/useApiConcentratorStaticData"

export function useApiConcentratorId({
  targetAsset,
}: {
  targetAsset: Address | undefined
}) {
  const apiQuery = useApiConcentratorStaticData()
  const targetAssetToConcentratorId: Record<Address, number> = {} // target to concentratorId
  apiQuery.data?.map((data) => {
    const curTargetAsset = data?.target_asset?.address
    if (
      targetAsset !== undefined &&
      targetAsset.toLocaleUpperCase() === curTargetAsset.toLocaleUpperCase()
    ) {
      targetAssetToConcentratorId[data?.target_asset?.address] =
        data?.concentrator?.ybToken.concentratorId
    }
  })

  return {
    ...apiQuery,
    data:
      Object.keys(targetAssetToConcentratorId).length > 0
        ? targetAssetToConcentratorId[targetAsset ?? "0x"]
        : -1,
  }
}

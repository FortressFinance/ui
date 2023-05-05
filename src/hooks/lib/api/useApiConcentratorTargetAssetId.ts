import { Address } from "wagmi"

import { useApiConcentratorStaticData } from "@/hooks/lib/api/useApiConcentratorStaticData"

export function useApiConcentratorTargetAssetId({
  targetAsset,
}: {
  targetAsset: Address | undefined
}) {
  const apiQuery = useApiConcentratorStaticData()
  const targetAssetToId: Record<Address, number> = {} // target to targetId
  apiQuery.data?.map((data) => {
    const curTargetAsset = data?.target_asset?.address
    if (
      targetAsset !== undefined &&
      targetAsset.toLocaleUpperCase() === curTargetAsset.toLocaleUpperCase()
    ) {
      targetAssetToId[targetAsset] = data?.target_asset?.targetAssetId
    }
  })

  return {
    ...apiQuery,
    data:
      Object.keys(targetAssetToId).length > 0
        ? targetAssetToId[targetAsset ?? "0x"]
        : -1,
  }
}

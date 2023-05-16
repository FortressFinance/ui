import { Address } from "wagmi"

import { useApiConcentratorStaticData } from "@/hooks/lib/api/useApiConcentratorStaticData"

export function useApiConcentratorId({
  targetAsset,
  primaryAsset,
}: {
  targetAsset?: Address
  primaryAsset?: Address
}) {
  const apiQuery = useApiConcentratorStaticData()
  const targetAssetToConcentratorId: Record<Address, number> = {} // target to concentratorId
  apiQuery.data?.forEach((data) => {
    const curTargetAsset = data?.target_asset?.address
    const curPrimaryAsset = data.concentrator.primaryAsset?.address
    if (
      !!targetAsset &&
      !!primaryAsset &&
      !!curTargetAsset &&
      !!curPrimaryAsset &&
      targetAsset.toLocaleUpperCase() === curTargetAsset.toLocaleUpperCase() &&
      primaryAsset.toLocaleLowerCase() === curPrimaryAsset.toLocaleLowerCase()
    ) {
      targetAssetToConcentratorId[targetAsset] =
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

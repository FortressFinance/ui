import { Address } from "wagmi"

import { useApiConcentratorStaticData } from "@/hooks/lib/api/useApiConcentratorStaticData"

export function useApiConcentratorUnderlyingAssets({
  targetAsset,
  primaryAsset,
}: {
  targetAsset?: Address
  primaryAsset?: Address
}) {
  const apiQuery = useApiConcentratorStaticData()
  const targetAssetToUnderlying: Record<Address, Address[]> = {} // target to underlying
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
      targetAssetToUnderlying[targetAsset] =
        data?.concentrator?.undelyingAssets?.map((x) => x.address)
    }
  })

  return {
    ...apiQuery,
    data: targetAssetToUnderlying[targetAsset ?? "0x"],
  }
}

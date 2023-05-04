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
  apiQuery.data?.map((data) => {
    const curTargetAsset = data?.target_asset?.address
    const curPrimaryAsset = data.concentrator.primaryAsset?.address
    if (
      targetAsset !== undefined &&
      targetAsset.toLocaleUpperCase() === curTargetAsset.toLocaleUpperCase() &&
      primaryAsset !== undefined &&
      primaryAsset.toLocaleLowerCase() === curPrimaryAsset.toLocaleLowerCase()
    ) {
      targetAssetToUnderlying[data?.target_asset?.address] =
        data?.concentrator?.undelyingAssets?.map((x) => x.address)
    }
  })

  return {
    ...apiQuery,
    data: targetAssetToUnderlying[targetAsset ?? "0x"],
  }
}

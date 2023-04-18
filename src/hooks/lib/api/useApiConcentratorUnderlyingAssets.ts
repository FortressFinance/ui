import { Address } from "wagmi"

import { useApiConcentratorStaticData } from "@/hooks/lib/api/useApiConcentratorStaticData"

export function useApiConcentratorUnderlyingAssets({
  targetAsset,
}: {
  targetAsset: Address | undefined
}) {
  const apiQuery = useApiConcentratorStaticData()
  const targetAssetToUnderlying: Record<Address, Address[]> = {} // target to underlying
  apiQuery.data?.map((data) => {
    const curTargetAsset = data?.target_asset?.address
    if (
      targetAsset !== undefined &&
      targetAsset.toLocaleUpperCase() === curTargetAsset.toLocaleUpperCase()
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

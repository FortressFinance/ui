import { Address } from "wagmi"

import { useApiConcentratorStaticData } from "@/hooks/lib/api/useApiConcentratorStaticData"
import { useCategoriesByPrimaryAsset } from "@/hooks/useCategoriesByPrimaryAsset"

export function useApiConcentratorPrimaryAssets({
  concentratorTargetAssets,
  enabled,
}: {
  concentratorTargetAssets?: Address[]
  enabled: boolean
}) {
  const filterCategoriesByPrimaryAsset = useCategoriesByPrimaryAsset()
  const apiQuery = useApiConcentratorStaticData({ enabled })
  const targetAssetToPrimaryAsset: Record<Address, Set<Address>> = {} // target to primaryKey
  apiQuery.data?.map((data) => {
    const targetAsset = data?.target_asset?.address
    if (
      concentratorTargetAssets !== undefined &&
      concentratorTargetAssets.includes(targetAsset)
    ) {
      if (!targetAssetToPrimaryAsset[data?.target_asset?.address]) {
        targetAssetToPrimaryAsset[data?.target_asset?.address] = new Set()
      }
      targetAssetToPrimaryAsset[data?.target_asset?.address].add(
        data?.concentrator?.primaryAsset?.address
      )
    }
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const primaryAssets: any[] = []
  for (const targetAssetKey in targetAssetToPrimaryAsset) {
    targetAssetToPrimaryAsset[targetAssetKey as Address].forEach(
      (primaryAsset) => {
        primaryAssets.push({
          concentratorTargetAsset: targetAssetKey,
          filterCategories: filterCategoriesByPrimaryAsset[primaryAsset] ?? [],
          vaultAssetAddress: primaryAsset,
          vaultType: "curve",
        })
      }
    )
  }
  return {
    ...apiQuery,
    data: primaryAssets,
  }
}

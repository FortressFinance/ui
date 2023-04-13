import { Address } from "wagmi"

import { useApiConcentratorStaticData } from "@/hooks/lib/api/useApiConcentratorStaticData"
import { useCategoriesByPrimaryAsset } from "@/hooks/useCategoriesByPrimaryAsset"

export function useApiConcentratorPrimaryAssets({
  concentratorTargetAssets,
}: {
  concentratorTargetAssets: Address[] | undefined
}) {
  const filterCategoriesByPrimaryAsset = useCategoriesByPrimaryAsset()
  const apiQuery = useApiConcentratorStaticData()
  const targetAssetToPrimaryAsset: Record<Address, Address> = {} // target to primaryKey
  apiQuery.data?.map((data) => {
    const targetAsset = data?.target_asset?.address
    if (
      concentratorTargetAssets !== undefined &&
      concentratorTargetAssets.includes(targetAsset)
    ) {
      targetAssetToPrimaryAsset[data?.target_asset?.address] =
        data?.concentrator?.primaryAsset?.address
    }
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const primaryAssets: any[] = []
  for (const targetAsset in targetAssetToPrimaryAsset) {
    const primaryAsset = targetAssetToPrimaryAsset[targetAsset as Address]
    primaryAssets.push({
      concentratorTargetAsset: targetAsset,
      filterCategories: filterCategoriesByPrimaryAsset[primaryAsset] ?? [],
      vaultAssetAddress: primaryAsset,
      vaultType: "curve",
    })
  }
  return {
    ...apiQuery,
    data: primaryAssets,
  }
}

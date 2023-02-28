import { Address } from "wagmi"

import { FilterCategory } from "@/lib/types"
import { useListConcentrators } from "@/hooks/data/concentrators"

export function useFilteredConcentrators({
  concentratorsList,
  concentratorTargetAsset,
  filterCategory,
}: {
  concentratorsList: ReturnType<typeof useListConcentrators>
  concentratorTargetAsset?: Address
  filterCategory?: FilterCategory
}) {
  return concentratorsList.data?.filter(
    (v) =>
      v?.concentratorTargetAsset === concentratorTargetAsset &&
      (filterCategory ? v.filterCategories.includes(filterCategory) : true)
  )
}

export function useFirstConcentrator({
  concentratorsList,
  concentratorTargetAsset,
  filterCategory,
}: {
  concentratorsList: ReturnType<typeof useListConcentrators>
  concentratorTargetAsset?: Address
  filterCategory?: FilterCategory
}) {
  // this is pretty convoluted...
  // get the vaults relevant to this concentrator
  const vaultsForThisConcentrator = useFilteredConcentrators({
    concentratorsList,
    concentratorTargetAsset,
    filterCategory,
  })
  // take the first one, because they all have the same vaultAssetAddress + compounder address
  return vaultsForThisConcentrator?.[0]
}

import { FilterCategory, VaultType } from "@/lib/types"
import { useListCompounders } from "@/hooks/useListCompounders"

export function useFilteredCompounders({
  compoundersList,
  filterCategory,
  vaultType,
}: {
  compoundersList: ReturnType<typeof useListCompounders>
  filterCategory?: FilterCategory
  vaultType?: VaultType
}) {
  return compoundersList.data?.filter(
    (v) =>
      (vaultType ? v.vaultType === vaultType : true) &&
      (filterCategory ? v.filterCategories.includes(filterCategory) : true)
  )
}

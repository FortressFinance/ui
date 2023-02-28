import { VaultType } from "@/lib/types"
import { useYieldCompoundersRegistryContract } from "@/hooks/contracts/useYieldCompoundersRegistry"
import { useCategoriesByPrimaryAsset, useFallbackReads } from "@/hooks/util"

const vaultTypeByIndex: VaultType[] = ["curve", "balancer", "token"]

export function useListCompounders() {
  // TODO: Preferred: API request
  // const apiCompounderQuery = useApiCompounderVaults({ type })
  // const apiTokenQuery = useApiTokenVaults({ type })

  // Fallback: contract requests
  const filterCategoriesByPrimaryAsset = useCategoriesByPrimaryAsset()
  const yieldCompoundersRegistryContract = useYieldCompoundersRegistryContract()
  const primaryAssets = useFallbackReads(
    {
      contracts: [
        {
          ...yieldCompoundersRegistryContract,
          functionName: "getAmmCompoundersPrimaryAssets",
          args: [true],
        },
        {
          ...yieldCompoundersRegistryContract,
          functionName: "getAmmCompoundersPrimaryAssets",
          args: [false],
        },
        {
          ...yieldCompoundersRegistryContract,
          functionName: "getTokenCompoundersPrimaryAssets",
        },
      ],
      select: (data) =>
        data
          .map(
            (vaultAssetAddresses, index) =>
              vaultAssetAddresses?.map((vaultAssetAddress) => ({
                vaultAssetAddress,
                filterCategories:
                  filterCategoriesByPrimaryAsset[vaultAssetAddress] ?? [],
                vaultType: vaultTypeByIndex[index],
              })) ?? []
          )
          .flat(),
    },
    []
  )

  return primaryAssets
}

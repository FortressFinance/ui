import { VaultType } from "@/lib/types"
import { useFallbackReads } from "@/hooks/lib/useFallbackRequest"
import { useRegistryContract } from "@/hooks/lib/useRegistryContract"
import { useCategoriesByPrimaryAsset } from "@/hooks/useCategoriesByPrimaryAsset"

const vaultTypeByIndex: VaultType[] = ["curve", "balancer", "token"]

export function useListCompounders() {
  // TODO: Preferred: API request
  // const apiCompounderQuery = useApiCompounderVaults({ type })
  // const apiTokenQuery = useApiTokenVaults({ type })

  // Fallback: contract requests
  const filterCategoriesByPrimaryAsset = useCategoriesByPrimaryAsset()
  const registryContract = useRegistryContract()
  const primaryAssets = useFallbackReads(
    {
      contracts: [
        {
          ...registryContract,
          functionName: "getAmmCompoundersPrimaryAssets",
          args: [true],
        },
        {
          ...registryContract,
          functionName: "getAmmCompoundersPrimaryAssets",
          args: [false],
        },
        {
          ...registryContract,
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

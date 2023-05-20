import { useContractReads } from "wagmi"

import { VaultType } from "@/lib/types"
import { useRegistryContract } from "@/hooks/lib/useRegistryContract"
import { useCategoriesByPrimaryAsset } from "@/hooks/useCategoriesByPrimaryAsset"

const vaultTypeByIndex: VaultType[] = ["token", "curve", "balancer"]

export function useListCompounders() {
  const filterCategoriesByPrimaryAsset = useCategoriesByPrimaryAsset()
  const registryContract = useRegistryContract()
  return useContractReads({
    contracts: [
      {
        ...registryContract,
        functionName: "getTokenCompoundersPrimaryAssets",
      },
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
    ],
    select: (results) =>
      results
        .map(
          (vaultAssetAddresses, index) =>
            vaultAssetAddresses.result?.map((vaultAssetAddress) => ({
              vaultAssetAddress,
              filterCategories:
                filterCategoriesByPrimaryAsset[vaultAssetAddress] ?? [],
              vaultType: vaultTypeByIndex[index],
            })) ?? []
        )
        .flat(),
  })
}

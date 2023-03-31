import { useFallbackReads } from "@/hooks/lib/useFallbackRequest"
import { useRegistryContract } from "@/hooks/lib/useRegistryContract"
import { useConcentratorTargetAssets } from "@/hooks/useConcentratorTargetAssets"

// const vaultTypeByIndex: VaultType[] = [
//   "curve",
//   "balancer",
//   "curve",
//   "balancer",
//   "curve",
//   "balancer",
//   "curve",
//   "balancer",
// ]

export function useListConcentrators({
  concentratorTargetAssets,
}: {
  concentratorTargetAssets: ReturnType<typeof useConcentratorTargetAssets>
}) {
  //const filterCategoriesByPrimaryAsset = useCategoriesByPrimaryAsset()
  const registryContract = useRegistryContract()
  const primaryAssetContracts = []
  concentratorTargetAssets.data?.map((assetAddress) => {
    primaryAssetContracts.push({
      ...registryContract,
      functionName: "getConcentratorPrimaryAssets",
      args: [true, assetAddress ?? "0x"],
    })
    primaryAssetContracts.push({
      ...registryContract,
      functionName: "getConcentratorPrimaryAssets",
      args: [false, assetAddress ?? "0x"],
    })
  })
  const concentrators = useFallbackReads(
    {
      //contracts: [...primaryAssetContracts],
      enabled: concentratorTargetAssets.isSuccess,
      // select: (data) =>
      //   data
      //     .map(
      //       (vaultAssetAddresses, index) =>
      //         vaultAssetAddresses?.map((vaultAssetAddress) => ({
      //           concentratorTargetAsset: concentratorTargetAssets.data?.[index],
      //           filterCategories:
      //             filterCategoriesByPrimaryAsset[vaultAssetAddress] ?? [],
      //           vaultAssetAddress: vaultAssetAddress,
      //           vaultType: vaultTypeByIndex[index],
      //         })) ?? []
      //     )
      //     .flat(),
    },
    []
  )
  return concentrators
}

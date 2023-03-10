import { VaultType } from "@/lib/types"
import { useRegistryContract } from "@/hooks/contracts"
import { useConcentratorTargetAssets } from "@/hooks/data/concentrators/useConcentratorTargetAssets"
import { useCategoriesByPrimaryAsset, useFallbackReads } from "@/hooks/util"

const vaultTypeByIndex: VaultType[] = [
  "curve",
  "balancer",
  "curve",
  "balancer",
  "curve",
  "balancer",
  "curve",
  "balancer",
]

export function useListConcentrators({
  concentratorTargetAssets,
}: {
  concentratorTargetAssets: ReturnType<typeof useConcentratorTargetAssets>
}) {
  const filterCategoriesByPrimaryAsset = useCategoriesByPrimaryAsset()
  const registryContract = useRegistryContract()
  const concentrators = useFallbackReads(
    {
      contracts: [
        {
          ...registryContract,
          functionName: "getConcentratorPrimaryAssets",
          args: [true, concentratorTargetAssets.data?.[0] ?? "0x"],
        },
        {
          ...registryContract,
          functionName: "getConcentratorPrimaryAssets",
          args: [false, concentratorTargetAssets.data?.[0] ?? "0x"],
        },
        {
          ...registryContract,
          functionName: "getConcentratorPrimaryAssets",
          args: [true, concentratorTargetAssets.data?.[1] ?? "0x"],
        },
        {
          ...registryContract,
          functionName: "getConcentratorPrimaryAssets",
          args: [false, concentratorTargetAssets.data?.[1] ?? "0x"],
        },
        {
          ...registryContract,
          functionName: "getConcentratorPrimaryAssets",
          args: [true, concentratorTargetAssets.data?.[2] ?? "0x"],
        },
        {
          ...registryContract,
          functionName: "getConcentratorPrimaryAssets",
          args: [false, concentratorTargetAssets.data?.[2] ?? "0x"],
        },
        {
          ...registryContract,
          functionName: "getConcentratorPrimaryAssets",
          args: [true, concentratorTargetAssets.data?.[3] ?? "0x"],
        },
        {
          ...registryContract,
          functionName: "getConcentratorPrimaryAssets",
          args: [false, concentratorTargetAssets.data?.[3] ?? "0x"],
        },
      ],
      enabled: concentratorTargetAssets.isSuccess,
      select: (data) =>
        data
          .map(
            (vaultAssetAddresses, index) =>
              vaultAssetAddresses?.map((vaultAssetAddress) => ({
                concentratorTargetAsset: concentratorTargetAssets.data?.[index],
                filterCategories:
                  filterCategoriesByPrimaryAsset[vaultAssetAddress] ?? [],
                vaultAssetAddress: vaultAssetAddress,
                vaultType: vaultTypeByIndex[index],
              })) ?? []
          )
          .flat(),
    },
    []
  )
  return concentrators
}

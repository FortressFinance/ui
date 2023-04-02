import { Address } from "wagmi"

import { VaultType } from "@/lib/types"
import { useFallbackReads } from "@/hooks/lib/useFallbackRequest"
import { useRegistryContract } from "@/hooks/lib/useRegistryContract"
import { useCategoriesByPrimaryAsset } from "@/hooks/useCategoriesByPrimaryAsset"
import { useConcentratorTargetAssets } from "@/hooks/useConcentratorTargetAssets"

import { YieldOptimizersRegistry } from "@/constant/abi"

export function useListConcentrators({
  concentratorTargetAssets,
}: {
  concentratorTargetAssets: ReturnType<typeof useConcentratorTargetAssets>
}) {
  const filterCategoriesByPrimaryAsset = useCategoriesByPrimaryAsset()
  const registryContract = useRegistryContract()
  const primaryAssetContracts: {
    chainId: number
    abi: typeof YieldOptimizersRegistry
    address: Address
    functionName: string
    args: (boolean | Address)[]
  }[] = []
  concentratorTargetAssets.data?.map((assetAddress) => {
    // for curve
    primaryAssetContracts.push({
      ...registryContract,
      functionName: "getConcentratorPrimaryAssets",
      args: [true, assetAddress ?? "0x"],
    })
    // for balancer
    primaryAssetContracts.push({
      ...registryContract,
      functionName: "getConcentratorPrimaryAssets",
      args: [false, assetAddress ?? "0x"],
    })
  })
  const concentrators = useFallbackReads(
    {
      contracts: primaryAssetContracts,
      enabled: concentratorTargetAssets.isSuccess,
      select: (data) => {
        const dataTab = data as [readonly Address[]]
        if (dataTab) {
          const flatConcentrators = dataTab
            .map(
              (vaultAssetAddresses, index) =>
                vaultAssetAddresses?.map((vaultAssetAddress) => ({
                  concentratorTargetAsset:
                    concentratorTargetAssets.data?.[
                      index % 2 == 0 ? index / 2 : (index - 1) / 2
                    ],
                  filterCategories:
                    filterCategoriesByPrimaryAsset[vaultAssetAddress] ?? [],
                  vaultAssetAddress: vaultAssetAddress,
                  vaultType: (index % 2 == 0
                    ? "curve"
                    : "balancer") as VaultType,
                })) ?? []
            )
            .flat()
          return flatConcentrators
        }
        return undefined
      },
    },
    []
  )
  return concentrators
}

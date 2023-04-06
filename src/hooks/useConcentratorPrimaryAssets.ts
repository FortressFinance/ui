import { Address } from "wagmi"

import { VaultType } from "@/lib/types"
import { useFallbackReads } from "@/hooks/lib/useFallbackRequest"
import { useRegistryContract } from "@/hooks/lib/useRegistryContract"
import { useCategoriesByPrimaryAsset } from "@/hooks/useCategoriesByPrimaryAsset"

import { YieldOptimizersRegistry } from "@/constant/abi"

export function useConcentratorPrimaryAssets({
  concentratorTargetAssets,
  enabled,
}: {
  concentratorTargetAssets: Address[] | undefined
  enabled: boolean
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
  concentratorTargetAssets?.map((targetAssetAddress) => {
    // for curve
    primaryAssetContracts.push({
      ...registryContract,
      functionName: "getConcentratorPrimaryAssets",
      args: [true, targetAssetAddress ?? "0x"],
    })
    // for balancer
    primaryAssetContracts.push({
      ...registryContract,
      functionName: "getConcentratorPrimaryAssets",
      args: [false, targetAssetAddress ?? "0x"],
    })
  })
  const primaryAssets = useFallbackReads(
    {
      contracts: primaryAssetContracts,
      enabled: enabled && concentratorTargetAssets !== undefined,
      select: (data) => {
        const dataTab = data as [readonly Address[]]
        if (dataTab) {
          const flatPrimaryAssets = dataTab
            .map(
              (primaryAssetsAddresses, index) =>
                primaryAssetsAddresses?.map((primaryAssetAddress) => ({
                  concentratorTargetAsset:
                    concentratorTargetAssets?.[
                      index % 2 == 0 ? index / 2 : (index - 1) / 2
                    ],
                  filterCategories:
                    filterCategoriesByPrimaryAsset[primaryAssetAddress] ?? [],
                  vaultAssetAddress: primaryAssetAddress,
                  vaultType: (index % 2 == 0
                    ? "curve"
                    : "balancer") as VaultType,
                })) ?? []
            )
            .flat()
          return flatPrimaryAssets
        }
        return undefined
      },
    },
    []
  )
  return primaryAssets
}

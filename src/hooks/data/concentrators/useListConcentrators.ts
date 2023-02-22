import { useContractReads } from "wagmi"

import { FilterCategory, TargetAsset, VaultType } from "@/lib/types"
import useRegistryContract from "@/hooks/useRegistryContract"

// This hardcoding will need to be replaced either with improved contracts
// or with chain-aware values for production

const filterCategoryByIndex: FilterCategory[][] = [
  ["balancer", "crypto", "featured", "stable"],
  ["curve", "crypto", "featured"],
  ["balancer"],
  ["curve"],
]
const targetAssetByIndex: TargetAsset[] = ["auraBAL", "cvxCRV", "ETH", "ETH"]
const vaultTypeByIndex: VaultType[] = ["token", "token", "balancer", "curve"]

export function useListConcentrators() {
  const registryContract = useRegistryContract()
  return useContractReads({
    contracts: [
      {
        ...registryContract,
        functionName: "getBalancerAuraBalConcentratorsList",
      },
      {
        ...registryContract,
        functionName: "getCurveCvxCrvConcentratorsList",
      },
      {
        ...registryContract,
        functionName: "getBalancerEthConcentratorsList",
      },
      {
        ...registryContract,
        functionName: "getCurveEthConcentratorsList",
      },
    ],
    select: (data) =>
      data
        .map((vaultAssetAddresses, index) =>
          vaultAssetAddresses?.map((vaultAssetAddress) => ({
            concentratorTargetAsset: targetAssetByIndex[index],
            filterCategories: filterCategoryByIndex[index],
            vaultAssetAddress: vaultAssetAddress,
            vaultType: vaultTypeByIndex[index],
          }))
        )
        .flat(),
  })
}

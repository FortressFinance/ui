import { Address, useContractRead, useContractReads } from "wagmi"

import { ETH_TOKEN_ADDRESS } from "@/lib/isEthTokenAddress"
import { FilterCategory, VaultType } from "@/lib/types"
import useActiveChainId from "@/hooks/useActiveChainId"
import useRegistryContract from "@/hooks/useRegistryContract"

import { vaultCompounderAbi } from "@/constant/abi"

// This hardcoding will need to be replaced either with improved contracts
// or with chain-aware values for production

const filterCategoryByIndex: FilterCategory[][] = [
  ["balancer", "crypto", "featured", "stable"],
  ["curve", "crypto", "featured"],
  ["balancer"],
  ["curve"],
]
const targetAssetByIndex: Address[] = [
  "0x616e8BfA43F920657B3497DBf40D6b1A02D4608d",
  "0x62B9c7356A2Dc64a1969e19C23e4f579F9810Aa7",
  ETH_TOKEN_ADDRESS,
  ETH_TOKEN_ADDRESS,
]
const vaultTypeByIndex: VaultType[] = ["token", "token", "balancer", "curve"]

export function useAllConcentratorVaults() {
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
          vaultAssetAddresses.map((vaultAssetAddress) => ({
            concentratorTargetAsset: targetAssetByIndex[index],
            filterCategories: filterCategoryByIndex[index],
            vaultAssetAddress: vaultAssetAddress,
            vaultType: vaultTypeByIndex[index],
          }))
        )
        .flat(),
  })
}

export function useFilteredConcentratorVaults({
  concentratorTargetAsset,
  filterCategory,
}: {
  concentratorTargetAsset: Address
  filterCategory: FilterCategory
}) {
  const allConcentratorVaults = useAllConcentratorVaults()

  return {
    ...allConcentratorVaults,
    data: allConcentratorVaults.data?.filter(
      (v) =>
        v.filterCategories.includes(filterCategory) &&
        v.concentratorTargetAsset === concentratorTargetAsset
    ),
  }
}

export function useConcentratorVault({
  concentratorTargetAsset,
  vaultAssetAddress,
  vaultType,
}: {
  concentratorTargetAsset: Address
  vaultAssetAddress?: Address
  vaultType: VaultType
}) {
  const chainId = useActiveChainId()

  // get the compounder address for this concentrator
  const compounderQuery = useContractRead({
    ...useRegistryContract(),
    functionName:
      concentratorTargetAsset === "0x616e8BfA43F920657B3497DBf40D6b1A02D4608d"
        ? "getBalancerAuraBalConcentratorCompounder"
        : concentratorTargetAsset ===
          "0x62B9c7356A2Dc64a1969e19C23e4f579F9810Aa7"
        ? "getCurveCvxCrvConcentratorCompounder"
        : vaultType === "balancer"
        ? "getBalancerEthConcentratorCompounder"
        : "getCurveEthConcentratorsCompounder",
    args: [vaultAssetAddress ?? "0x"],
    enabled: !!vaultAssetAddress,
  })

  // get the asset for the compounder
  const assetQuery = useContractRead({
    chainId,
    abi: vaultCompounderAbi,
    address: compounderQuery.data,
    functionName: "asset",
    enabled: compounderQuery.isSuccess,
  })

  // return normalized data "VaultProps"
  const queries = [compounderQuery, assetQuery]
  return {
    isError: queries.some((q) => q.isError),
    isLoading: queries.some((q) => q.isLoading),
    isFetching: queries.some((q) => q.isFetching),
    data: {
      asset: assetQuery.data,
      type: vaultType,
    },
  }
}

export function useConcentratorAddress({
  concentratorTargetAsset,
  filterCategory,
}: {
  concentratorTargetAsset: Address
  filterCategory: FilterCategory
}) {
  // this is pretty convoluted...
  // get the vaults relevant to this concentrator
  const vaultsForThisConcentrator = useFilteredConcentratorVaults({
    concentratorTargetAsset,
    filterCategory,
  })
  // take the first one, because they all have the same vaultAssetAddress
  const firstVaultForThisConcentrator = vaultsForThisConcentrator.data?.[0]
  // use the vaultAssetAddress to get the concentrator address
  return useContractRead({
    ...useRegistryContract(),
    functionName:
      concentratorTargetAsset === "0x616e8BfA43F920657B3497DBf40D6b1A02D4608d"
        ? "getBalancerAuraBalConcentrator"
        : concentratorTargetAsset ===
          "0x62B9c7356A2Dc64a1969e19C23e4f579F9810Aa7"
        ? "getCurveCvxCrvConcentrator"
        : firstVaultForThisConcentrator?.vaultType === "balancer"
        ? "getBalancerEthConcentrators"
        : "getCurveEthConcentrators",
    args: [firstVaultForThisConcentrator?.vaultAssetAddress ?? "0x"],
    enabled:
      !!firstVaultForThisConcentrator?.vaultAssetAddress &&
      !!firstVaultForThisConcentrator?.vaultType,
  })
}

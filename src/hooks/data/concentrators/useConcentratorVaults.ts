import { Address, useContractRead, useContractReads } from "wagmi"

import { ConcentratorTargetAsset, FilterCategory, VaultType } from "@/lib/types"
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
const targetAssetByIndex: ConcentratorTargetAsset[] = [
  "auraBAL",
  "cvxCRV",
  "ETH",
  "ETH",
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
  concentratorTargetAsset: ConcentratorTargetAsset
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
  concentratorTargetAsset: ConcentratorTargetAsset
  vaultAssetAddress?: Address
  vaultType: VaultType
}) {
  const chainId = useActiveChainId()

  // get the compounder address for this concentrator
  const compounderQuery = useContractRead({
    ...useRegistryContract(),
    functionName:
      concentratorTargetAsset === "auraBAL"
        ? "getBalancerAuraBalConcentratorCompounder"
        : concentratorTargetAsset === "cvxCRV"
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
  vaultAssetAddress,
  vaultType,
}: {
  concentratorTargetAsset: ConcentratorTargetAsset
  vaultAssetAddress?: Address
  vaultType?: VaultType
}) {
  return useContractRead({
    ...useRegistryContract(),
    functionName:
      concentratorTargetAsset === "auraBAL"
        ? "getBalancerAuraBalConcentrator"
        : concentratorTargetAsset === "cvxCRV"
        ? "getCurveCvxCrvConcentrator"
        : vaultType === "balancer"
        ? "getBalancerEthConcentrators"
        : "getCurveEthConcentrators",
    args: [vaultAssetAddress ?? "0x"],
    enabled: !!vaultAssetAddress && !!vaultType,
  })
}

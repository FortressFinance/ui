import { Address, useContractRead, useContractReads } from "wagmi"

import { FilterCategory, TargetAsset, VaultType } from "@/lib/types"
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

export function useConcentrator({
  concentratorTargetAsset,
  vaultAssetAddress,
  vaultType,
}: {
  concentratorTargetAsset?: TargetAsset
  vaultAssetAddress?: Address
  vaultType?: VaultType
}) {
  const chainId = useActiveChainId()

  // get the compounder address for this concentrator
  const registryContract = useRegistryContract()
  const concentratorQueries = useContractReads({
    contracts: [
      {
        ...registryContract,
        functionName:
          concentratorTargetAsset === "auraBAL"
            ? "getBalancerAuraBalConcentratorCompounder"
            : concentratorTargetAsset === "cvxCRV"
            ? "getCurveCvxCrvConcentratorCompounder"
            : vaultType === "balancer"
            ? "getBalancerEthConcentratorCompounder"
            : "getCurveEthConcentratorsCompounder",
        args: [vaultAssetAddress ?? "0x"],
      },
      {
        ...registryContract,
        functionName:
          concentratorTargetAsset === "auraBAL"
            ? "getBalancerAuraBalConcentrator"
            : concentratorTargetAsset === "cvxCRV"
            ? "getCurveCvxCrvConcentrator"
            : vaultType === "balancer"
            ? "getBalancerEthConcentrators"
            : "getCurveEthConcentrators",
        args: [vaultAssetAddress ?? "0x"],
      },
    ],
    enabled: !!vaultAssetAddress && !!vaultType,
  })

  // get the asset for the compounder
  const assetQuery = useContractRead({
    chainId,
    abi: vaultCompounderAbi,
    address: concentratorQueries.data?.[0],
    functionName: "asset",
    enabled: concentratorQueries.isSuccess,
  })

  // return normalized data "VaultProps"
  const queries = [concentratorQueries, assetQuery]
  return {
    isError: queries.some((q) => q.isError),
    isLoading: queries.some((q) => q.isLoading),
    isFetching: queries.some((q) => q.isFetching),
    data: {
      compounderAddress: concentratorQueries.data?.[0],
      concentratorAddress: concentratorQueries.data?.[1],
      vault: {
        asset: assetQuery.data,
        type: vaultType,
      },
    },
  }
}

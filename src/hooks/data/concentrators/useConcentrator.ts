import { Address, useContractRead, useContractReads } from "wagmi"

import { TargetAsset, VaultType } from "@/lib/types"
import useActiveChainId from "@/hooks/useActiveChainId"
import useRegistryContract from "@/hooks/useRegistryContract"

import { vaultCompounderAbi } from "@/constant/abi"

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
      {
        ...registryContract,
        functionName:
          concentratorTargetAsset === "auraBAL"
            ? "getBalancerAuraBalConcentratorSymbol"
            : concentratorTargetAsset === "cvxCRV"
            ? "getCurveCvxCrvConcentratorSymbol"
            : vaultType === "balancer"
            ? "getBalancerEthConcentratorsSymbol"
            : "getCurveEthConcentratorsSymbol",
        args: [vaultAssetAddress ?? "0x"],
      },
    ],
    enabled: !!vaultAssetAddress && !!vaultType,
  })

  // get the asset for the compounder
  const assetQuery = useContractRead({
    chainId,
    abi: vaultCompounderAbi,
    address: concentratorQueries.data?.[1],
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

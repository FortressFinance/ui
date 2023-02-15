import { Address, useContractRead } from "wagmi"

import { ConcentratorTargetAsset, VaultType } from "@/lib/types"
import useActiveChainId from "@/hooks/useActiveChainId"
import useRegistryContract from "@/hooks/useRegistryContract"

import { vaultCompounderAbi } from "@/constant/abi"

export function useConcentratorVaultAddresses({
  concentratorTargetAsset,
  vaultType,
}: {
  concentratorTargetAsset: ConcentratorTargetAsset
  vaultType: VaultType
}) {
  return useContractRead({
    ...useRegistryContract(),
    functionName:
      concentratorTargetAsset === "auraBAL"
        ? "getBalancerAuraBalConcentratorsList"
        : concentratorTargetAsset === "cvxCRV"
        ? "getCurveCvxCrvConcentratorsList"
        : vaultType === "balancer"
        ? "getBalancerEthConcentratorsList"
        : "getCurveEthConcentratorsList",
  })
}

export function useConcentratorVault({
  concentratorTargetAsset,
  vaultAssetAddress,
  vaultType,
}: {
  concentratorTargetAsset: ConcentratorTargetAsset
  vaultAssetAddress: Address | undefined
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

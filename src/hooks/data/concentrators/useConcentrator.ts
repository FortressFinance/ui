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
            ? "getBalancerAuraBalConcentratorName"
            : concentratorTargetAsset === "cvxCRV"
            ? "getCurveCvxCrvConcentratorName"
            : vaultType === "balancer"
            ? "getBalancerEthConcentratorsName"
            : "getCurveEthConcentratorsName",
        args: [vaultAssetAddress ?? "0x"],
      },
      {
        ...registryContract,
        functionName:
          concentratorTargetAsset === "auraBAL"
            ? "getBalancerAuraBalConcentratorUnderlyingAssets"
            : concentratorTargetAsset === "cvxCRV"
            ? "getCurveCvxCrvConcentratorUnderlyingAssets"
            : vaultType === "balancer"
            ? "getBalancerEthConcentratorsUnderlyingAssets"
            : "getCurveEthConcentratorsUnderlyingAssets",
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
  return {
    ...concentratorQueries,
    data: {
      name: concentratorQueries.data?.[2],
      ybTokenAddress: concentratorQueries.data?.[1],
      underlyingAssetAddresses: concentratorQueries.data?.[3],
      rewardTokenAddress: concentratorQueries.data?.[0],
      vault: {
        asset: assetQuery.data,
        type: vaultType,
      },
    },
  }
}

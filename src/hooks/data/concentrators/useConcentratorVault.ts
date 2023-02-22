import { Address } from "wagmi"

import { TargetAsset, VaultType } from "@/lib/types"
import useRegistryContract from "@/hooks/useRegistryContract"
import { useFallbackReads } from "@/hooks/util"

export function useConcentratorVault({
  concentratorTargetAsset,
  vaultAssetAddress,
  vaultType,
}: {
  concentratorTargetAsset?: TargetAsset
  vaultAssetAddress?: Address
  vaultType?: VaultType
}) {
  // TODO: Preferred: API request

  // Fallback: contract requests
  const registryContract = useRegistryContract()
  const fallbackRequest = useFallbackReads(
    {
      contracts: [
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
              ? "getBalancerAuraBalConcentratorCompounder"
              : concentratorTargetAsset === "cvxCRV"
              ? "getCurveCvxCrvConcentratorCompounder"
              : vaultType === "balancer"
              ? "getBalancerEthConcentratorCompounder"
              : "getCurveEthConcentratorsCompounder",
          args: [vaultAssetAddress ?? "0x"],
        },
      ],
      enabled: !!vaultAssetAddress && !!vaultType,
      select: (data) => ({
        ybTokenAddress: data[0],
        rewardTokenAddress: data[1],
      }),
    },
    []
  )

  return fallbackRequest
}

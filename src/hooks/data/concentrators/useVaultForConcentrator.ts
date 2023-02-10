import { Address, useContractRead } from "wagmi"

import { ConcentratorType, VaultProps } from "@/lib/types"
import useActiveChainId from "@/hooks/useActiveChainId"
import useRegistryContract from "@/hooks/useRegistryContract"

import { vaultCompounderAbi } from "@/constant/abi"

export type ConcentratorVaultProps = {
  asset: Address
  type: ConcentratorType
}

export function useVaultForConcentrator({
  asset,
  type,
}: ConcentratorVaultProps) {
  const chainId = useActiveChainId()

  // get the compounder address for this concentrator
  const compounderQuery = useContractRead({
    ...useRegistryContract(),
    functionName:
      type === "balancerAuraBal"
        ? "getBalancerAuraBalConcentratorCompounder"
        : type === "balancerEth"
        ? "getBalancerEthConcentratorCompounder"
        : type === "curveCvxCrv"
        ? "getCurveCvxCrvConcentratorCompounder"
        : "getCurveEthConcentratorsCompounder",
    args: [asset],
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
      type: (type === "balancerAuraBal" || type === "curveCvxCrv"
        ? "token"
        : type === "balancerEth"
        ? "balancer"
        : "curve") as VaultProps["type"],
    },
  }
}

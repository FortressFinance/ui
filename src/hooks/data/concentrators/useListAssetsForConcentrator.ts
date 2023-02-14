import { useContractRead } from "wagmi"

import { ConcentratorVaultProps } from "@/hooks/data/concentrators/useVaultForConcentrator"
import useRegistryContract from "@/hooks/useRegistryContract"

export function useListAssetsForConcentrator({
  type,
}: Pick<ConcentratorVaultProps, "type">) {
  return useContractRead({
    ...useRegistryContract(),
    functionName:
      type === "balancerAuraBal"
        ? "getBalancerAuraBalConcentratorsList"
        : type === "balancerEth"
        ? "getBalancerEthConcentratorsList"
        : type === "curveCvxCrv"
        ? "getCurveCvxCrvConcentratorsList"
        : "getCurveEthConcentratorsList",
  })
}

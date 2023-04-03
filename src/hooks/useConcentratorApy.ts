import { Address } from "wagmi"

import { VaultType } from "@/lib/types"
import useBalancerConcentratorVaultTotalApr from "@/hooks/lib/apr/concentrator/useBalancerConcentratorVaultTotalApr"
import useCurveConcentratorVaultTotalApr from "@/hooks/lib/apr/concentrator/useCurveConcentratorVaultTotalApr"
import { useIsCurveVault } from "@/hooks/useVaultTypes"

type ConcentratorApyProps = {
  asset: Address
  type: VaultType
}

export function useConcentratorApy({ asset, type }: ConcentratorApyProps) {
  const isCurve = useIsCurveVault(type)
  const curveVaultTotalApy = useCurveConcentratorVaultTotalApr({
    asset,
    enabled: isCurve ?? false,
  })
  const balancerVaultTotalApy =
    useBalancerConcentratorVaultTotalApr(/*{
    asset,
    enabled: !isCurve ?? false,
  }*/)

  if (isCurve) {
    return curveVaultTotalApy
  }

  return balancerVaultTotalApy
}

import { Address } from "wagmi"

import { useConcentratorVault } from "@/hooks/useConcentratorVault"
import { useShouldUseCurveFallback } from "@/hooks/useVaultTypes"

type ConcentratorVaultYbtokenAddressProps = {
  primaryAsset: Address
  targetAsset: Address
  enabled?: boolean
}

export function useConcentratorVaultYbtokenAddress({
  primaryAsset,
  targetAsset,
  enabled = true,
}: ConcentratorVaultYbtokenAddressProps) {
  const isCurve = useShouldUseCurveFallback(primaryAsset)
  const concentrator = useConcentratorVault({
    targetAsset,
    primaryAsset,
    type: isCurve ? "curve" : "balancer",
    enabled,
  })
  return concentrator?.data?.ybTokenAddress
}

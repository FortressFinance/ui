import { Address } from "wagmi"

import { useConcentratorVault } from "@/hooks/useConcentratorVault"
import { useShouldUseCurveFallback } from "@/hooks/useVaultTypes"

export function useConcentratorVaultYbtokenAddress({
  primaryAsset,
  targetAsset,
  enabled,
}: {
  primaryAsset: Address
  targetAsset: Address
  enabled: boolean
}) {
  const isCurve = useShouldUseCurveFallback(primaryAsset)
  const concentrator = useConcentratorVault({
    targetAsset,
    primaryAsset,
    type: isCurve ? "curve" : "balancer",
    enabled,
  })
  return concentrator?.data?.ybTokenAddress
}

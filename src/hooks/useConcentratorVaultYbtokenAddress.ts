import { Address } from "wagmi"

import { useConcentratorVault } from "@/hooks/useConcentratorVault"
import { useIsConcentratorCurveVault } from "@/hooks/useVaultTypes"

export function useConcentratorVaultYbtokenAddress({
  primaryAsset,
  targetAsset,
}: {
  primaryAsset: Address
  targetAsset: Address
}) {
  const isCurve = useIsConcentratorCurveVault(primaryAsset)
  const concentrator = useConcentratorVault({
    targetAsset,
    primaryAsset,
    type: isCurve ? "curve" : "balancer",
  })
  return concentrator?.data?.ybTokenAddress
}

import { Address } from "wagmi"

import { ProductType } from "@/lib/types"
import { useConcentratorVault } from "@/hooks/useConcentratorVault"
import { useIsConcentratorCurveVault } from "@/hooks/useVaultTypes"

export function useVaultYbtokenAddress({
  asset,
  vaultAddress,
  productType,
}: {
  asset: Address
  vaultAddress: Address
  productType: ProductType
}) {
  const isCompounderProduct = productType === "compounder"

  const isCurve = useIsConcentratorCurveVault(vaultAddress)
  const concentrator = useConcentratorVault({
    targetAsset: asset,
    primaryAsset: vaultAddress,
    type: isCurve ? "curve" : "balancer",
  })

  if (isCompounderProduct) {
    return vaultAddress
  }

  return concentrator?.data?.ybTokenAddress
}

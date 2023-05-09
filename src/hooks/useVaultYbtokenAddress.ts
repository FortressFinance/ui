import { Address } from "wagmi"

import { ProductType } from "@/lib/types"
import { useConcentratorFirstVaultType } from "@/hooks/useConcentratorFirstVaultType"
import { useConcentratorVault } from "@/hooks/useConcentratorVault"

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

  const firstConcentratorVaultType = useConcentratorFirstVaultType({
    targetAsset: asset,
  })
  const concentrator = useConcentratorVault({
    targetAsset: asset,
    primaryAsset: vaultAddress,
    type: firstConcentratorVaultType ?? "balancer",
  })

  if (isCompounderProduct) {
    return vaultAddress
  }

  return concentrator?.data?.ybTokenAddress
}

import { FC } from "react"

import { ConcentratorVaultProps, ProductType } from "@/lib/types"
import { useConcentratorVault } from "@/hooks"
import { useConcentratorUnderlyingAssets } from "@/hooks/useConcentratorUnderlyingAssets"

import { VaultDepositForm } from "@/components/VaultRow/lib"

export const ConcentratorVaultDepositForm: FC<ConcentratorVaultProps> = (
  props
) => {
  const concentrator = useConcentratorVault({
    concentratorTargetAsset: props.targetAsset,
    vaultAssetAddress: props.primaryAsset,
    vaultType: props.type ?? "balancer",
  })

  const { data: underlyingAssets } = useConcentratorUnderlyingAssets(props)
  const args = {
    ...props,
    inputToken: props.primaryAsset,
    outputToken: concentrator?.data?.ybTokenAddress,
    underlyingAssets,
    productType: "concentrator" as ProductType,
  }
  return <VaultDepositForm {...args} />
}

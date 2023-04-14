import { FC } from "react"

import { ConcentratorVaultProps, ProductType } from "@/lib/types"
import { useConcentratorVault } from "@/hooks"
import { useConcentratorUnderlyingAssets } from "@/hooks/useConcentratorUnderlyingAssets"

import { VaultWithdrawForm } from "@/components/VaultRow/lib"

export const ConcentratorVaultWithdrawForm: FC<ConcentratorVaultProps> = (
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
    inputToken: concentrator?.data?.ybTokenAddress,
    outputToken: props.primaryAsset,
    underlyingAssets,
    productType: "concentrator" as ProductType,
  }
  return <VaultWithdrawForm {...args} />
}

import { FC } from "react"

import { CompounderVaultProps, ProductType } from "@/lib/types"
import { useVault } from "@/hooks"

import { VaultWithdrawForm } from "@/components/VaultRow/lib"

export const CompounderVaultWithdrawForm: FC<CompounderVaultProps> = (
  props
) => {
  const vault = useVault(props)
  const underlyingAssets = vault.data?.underlyingAssets
  const args = {
    ...props,
    inputToken: props.vaultAddress,
    outputToken: props.asset,
    underlyingAssets,
    productType: "compounder" as ProductType,
  }
  return <VaultWithdrawForm {...args} />
}

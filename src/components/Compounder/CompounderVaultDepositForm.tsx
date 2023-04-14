import { FC } from "react"

import { CompounderVaultProps, ProductType } from "@/lib/types"
import { useVault } from "@/hooks"

import { VaultDepositForm } from "@/components/VaultRow/lib"

export const CompounderVaultDepositForm: FC<CompounderVaultProps> = (props) => {
  const vault = useVault(props)
  const underlyingAssets = vault.data?.underlyingAssets
  const args = {
    ...props,
    inputToken: props.asset,
    outputToken: props.vaultAddress,
    underlyingAssets,
    productType: "compounder" as ProductType,
  }
  return <VaultDepositForm {...args} />
}

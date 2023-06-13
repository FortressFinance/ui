import { FC } from "react"

import { VaultProps } from "@/lib/types"
import { useVault } from "@/hooks"

import { VaultDepositForm } from "@/components/VaultRow/lib"

export const CompounderVaultDepositForm: FC<VaultProps> = (props) => {
  const vault = useVault(props)
  return (
    <VaultDepositForm
      {...props}
      initInputToken={props.asset}
      initOutputToken={props.vaultAddress}
      underlyingAssets={vault.data?.underlyingAssets}
      productType="compounder"
    />
  )
}

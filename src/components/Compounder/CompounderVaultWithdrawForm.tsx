import { FC } from "react"

import { VaultProps } from "@/lib/types"
import { useVault } from "@/hooks"

import { VaultWithdrawForm } from "@/components/VaultRow/lib"

export const CompounderVaultWithdrawForm: FC<VaultProps> = (props) => {
  const vault = useVault(props)
  return (
    <VaultWithdrawForm
      {...props}
      defaultInputToken={props.vaultAddress}
      defaultOutputToken={props.asset}
      underlyingAssets={vault.data?.underlyingAssets}
      productType="compounder"
    />
  )
}

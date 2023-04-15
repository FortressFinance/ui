import { FC } from "react"

import { VaultProps } from "@/lib/types"
import { useConcentratorVault } from "@/hooks"
import { useConcentratorUnderlyingAssets } from "@/hooks/useConcentratorUnderlyingAssets"

import { VaultDepositForm } from "@/components/VaultRow/lib"

export const ConcentratorVaultDepositForm: FC<VaultProps> = (props) => {
  const concentrator = useConcentratorVault({
    targetAsset: props.vaultAddress,
    primaryAsset: props.asset,
    type: props.type ?? "balancer",
  })

  const { data: underlyingAssets } = useConcentratorUnderlyingAssets({
    targetAsset: props.vaultAddress,
    primaryAsset: props.asset,
  })
  return (
    <VaultDepositForm
      {...props}
      defaultInputToken={props.asset}
      defaultOutputToken={concentrator?.data?.ybTokenAddress}
      underlyingAssets={underlyingAssets}
      productType="concentrator"
    />
  )
}

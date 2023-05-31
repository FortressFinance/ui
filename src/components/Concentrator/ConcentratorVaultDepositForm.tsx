import { FC } from "react"

import { VaultProps } from "@/lib/types"
import { useConcentratorVault } from "@/hooks"
import { useConcentratorUnderlyingAssets } from "@/hooks/useConcentratorUnderlyingAssets"

import { VaultDepositForm } from "@/components/VaultRow/lib"

export const ConcentratorVaultDepositForm: FC<VaultProps> = (props) => {
  const concentrator = useConcentratorVault({
    targetAsset: props.asset,
    primaryAsset: props.vaultAddress,
    type: props.type ?? "balancer",
    enabled: true,
  })

  const { data: underlyingAssets } = useConcentratorUnderlyingAssets({
    targetAsset: props.asset,
    primaryAsset: props.vaultAddress,
  })
  return (
    <VaultDepositForm
      {...props}
      defaultInputToken={props.vaultAddress}
      defaultOutputToken={concentrator?.data?.ybTokenAddress}
      underlyingAssets={underlyingAssets}
      productType="concentrator"
    />
  )
}

import { FC } from "react"

import { VaultProps } from "@/lib/types"
import { useConcentratorVault } from "@/hooks"
import { useConcentratorUnderlyingAssets } from "@/hooks/useConcentratorUnderlyingAssets"

import { VaultWithdrawForm } from "@/components/VaultRow/lib"

export const ConcentratorVaultWithdrawForm: FC<VaultProps> = (props) => {
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
    <VaultWithdrawForm
      {...props}
      defaultInputToken={concentrator?.data?.ybTokenAddress}
      defaultOutputToken={props.asset}
      underlyingAssets={underlyingAssets}
      productType="concentrator"
    />
  )
}

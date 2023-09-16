import { FC } from "react"

import { VaultProps } from "@/lib/types"
import { useConcentratorVault } from "@/hooks"
import { useConcentratorUnderlyingAssets } from "@/hooks/useConcentratorUnderlyingAssets"

import { VaultWithdrawForm } from "@/components/VaultRow/lib"

export const ConcentratorVaultWithdrawForm: FC<VaultProps> = (props) => {
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
    <VaultWithdrawForm
      {...props}
      initInputToken={
        !concentrator?.data ? "0x" : concentrator?.data.ybTokenAddress
      }
      initOutputToken={props.vaultAddress}
      underlyingAssets={underlyingAssets}
      productType="concentrator"
    />
  )
}

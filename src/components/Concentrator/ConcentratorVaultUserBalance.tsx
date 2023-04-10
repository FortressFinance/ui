import { FC } from "react"

import clsxm from "@/lib/clsxm"
import { ConcentratorVaultProps } from "@/lib/types"
import { useConcentratorVault, useTokenOrNativeBalance } from "@/hooks"

import { AssetBalance, AssetBalanceUsd } from "@/components/Asset"

export const ConcentratorVaultUserBalance: FC<ConcentratorVaultProps> = (
  props
) => {
  const concentrator = useConcentratorVault({
    concentratorTargetAsset: props.targetAsset,
    vaultAssetAddress: props.primaryAsset,
    vaultType: props.type,
  })
  const { data: balance } = useTokenOrNativeBalance({
    address: concentrator?.data?.ybTokenAddres,
  })

  return (
    <div className={clsxm("lg:grid", { "lg:grid-rows-2": !!balance })}>
      <div>
        <AssetBalance address={concentrator?.data?.ybTokenAddress} abbreviate />
      </div>
      {balance && (
        <div className="text-xs max-lg:hidden">
          <AssetBalanceUsd
            asset={props.targetAsset}
            address={concentrator?.data?.ybTokenAddress}
            abbreviate
          />
        </div>
      )}
    </div>
  )
}

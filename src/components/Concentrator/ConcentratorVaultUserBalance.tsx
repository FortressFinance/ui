import { FC } from "react"

import clsxm from "@/lib/clsxm"
import { VaultProps } from "@/lib/types"
import { useConcentratorVault, useTokenOrNativeBalance } from "@/hooks"

import { AssetBalance, AssetBalanceUsd } from "@/components/Asset"

export const ConcentratorVaultUserBalance: FC<VaultProps> = (props) => {
  const concentrator = useConcentratorVault({
    targetAsset: props.asset,
    primaryAsset: props.vaultAddress,
    type: props.type,
  })
  const { data: balance } = useTokenOrNativeBalance({
    address: concentrator?.data?.ybTokenAddress,
  })

  return (
    <div className={clsxm("lg:grid", { "lg:grid-rows-2": !!balance })}>
      <div className="max-lg:hidden">
        <AssetBalance address={concentrator?.data?.ybTokenAddress} abbreviate />
      </div>
      {balance && (
        <div className="text-xs max-lg:text-sm">
          <AssetBalanceUsd
            asset={props.vaultAddress}
            address={concentrator?.data?.ybTokenAddress}
            abbreviate
          />
        </div>
      )}
    </div>
  )
}

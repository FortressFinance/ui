import { FC } from "react"

import clsxm from "@/lib/clsxm"
import { VaultProps } from "@/lib/types"
import { useTokenOrNativeBalance } from "@/hooks"

import { AssetBalance, AssetBalanceUsd } from "@/components/Asset"

export const VaultUserBalance: FC<VaultProps> = (props) => {
  const { data: balance } = useTokenOrNativeBalance({
    address: props.vaultAddress,
  })

  return (
    <div className={clsxm("lg:grid", { "lg:grid-rows-2": !!balance })}>
      <div>
        <AssetBalance address={props.vaultAddress} abbreviate />
      </div>
      {balance && (
        <div className="text-xs max-lg:hidden">
          <AssetBalanceUsd
            asset={props.asset}
            address={props.vaultAddress}
            abbreviate
          />
        </div>
      )}
    </div>
  )
}
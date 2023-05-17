import { FC } from "react"
import { useAccount } from "wagmi"

import { VaultProps } from "@/lib/types"

import { AssetBalance, AssetBalanceUsd } from "@/components/Asset"

export const CompounderVaultUserBalance: FC<VaultProps> = (props) => {
  const { isConnected } = useAccount()

  return isConnected ? (
    <div className="lg:grid lg:grid-rows-2">
      <div className="max-lg:hidden">
        <AssetBalance address={props.vaultAddress} maximumFractionDigits={2} />
      </div>
      <div className="text-xs max-lg:text-sm">
        <AssetBalanceUsd
          asset={props.asset}
          address={props.vaultAddress}
          abbreviate
        />
      </div>
    </div>
  ) : (
    <div>—</div>
  )
}

import { FC } from "react"
import { useAccount } from "wagmi"

import { VaultProps } from "@/lib/types"
import { useConcentratorVault } from "@/hooks"

import { AssetBalance, AssetBalanceUsd } from "@/components/Asset"

export const ConcentratorVaultUserBalance: FC<VaultProps> = (props) => {
  const { isConnected } = useAccount()
  const concentrator = useConcentratorVault({
    targetAsset: props.asset,
    primaryAsset: props.vaultAddress,
    type: props.type,
  })

  return isConnected ? (
    <div className="lg:grid lg:grid-rows-2">
      <div className="max-lg:hidden">
        <AssetBalance
          address={concentrator?.data?.ybTokenAddress}
          maximumFractionDigits={2}
        />
      </div>
      <div className="text-xs max-lg:text-sm">
        <AssetBalanceUsd
          asset={props.vaultAddress}
          address={concentrator?.data?.ybTokenAddress}
          abbreviate
        />
      </div>
    </div>
  ) : (
    <div>—</div>
  )
}

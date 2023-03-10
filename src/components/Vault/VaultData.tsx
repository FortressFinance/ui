import { FC } from "react"

import { VaultProps } from "@/lib/types"
import {
  useVault,
  useVaultApy,
  useVaultPoolId,
  useVaultTvl,
} from "@/hooks/data/vaults"

import { AssetBalance, AssetBalanceUsd } from "@/components/Asset"
import Currency from "@/components/Currency"
import Percentage from "@/components/Percentage"
import Skeleton from "@/components/Skeleton"

export const VaultName: FC<VaultProps> = (props) => {
  const vault = useVault(props)
  return (
    <Skeleton isLoading={vault.isLoading}>
      {vault.isLoading ? "Loading vault..." : vault.data?.name}
    </Skeleton>
  )
}

export const VaultApy: FC<VaultProps> = (props) => {
  const poolId = useVaultPoolId(props)
  const totalApy = useVaultApy({ ...props, poolId: poolId.data })

  return (
    <Skeleton isLoading={poolId.isLoading || totalApy.isLoading}>
      <Percentage>{totalApy.data ?? 0}</Percentage>
    </Skeleton>
  )
}

export const VaultTvl: FC<VaultProps> = (props) => {
  const poolId = useVaultPoolId(props)
  const tvl = useVaultTvl({ ...props, poolId: poolId.data })

  return (
    <Skeleton isLoading={poolId.isLoading || tvl.isLoading}>
      <Currency amount={tvl.data ?? 0} decimals={2} symbol="$" abbreviate />
    </Skeleton>
  )
}

export const VaultDepositedLpTokens: FC<VaultProps> = (props) => {
  return (
    <div className="grid grid-rows-2">
      <div>
        <AssetBalance address={props.vaultAddress} abbreviate />
      </div>
      <div className="text-xs">
        <AssetBalanceUsd
          asset={props.asset}
          address={props.vaultAddress}
          abbreviate
        />
      </div>
    </div>
  )
}

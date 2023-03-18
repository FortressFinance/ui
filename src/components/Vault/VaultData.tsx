import { BigNumber } from "ethers"
import { FC } from "react"
import { useAccount } from "wagmi"

import clsxm from "@/lib/clsxm"
import { VaultProps } from "@/lib/types"
import {
  useVault,
  useVaultApy,
  useVaultPoolId,
  useVaultTvl,
} from "@/hooks/data/vaults"
import { useVaultUserEarnings } from "@/hooks/data/vaults"
import useTokenOrNative from "@/hooks/useTokenOrNative"
import useTokenOrNativeBalance from "@/hooks/useTokenOrNativeBalance"

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

export const VaultUserEarnings: FC<VaultProps> = (props) => {
  const poolId = useVaultPoolId(props)
  const earnings = useVaultUserEarnings({
    poolId: poolId.data,
    type: props.type,
  })
  const token = useTokenOrNative({ address: props.asset })
  const { isConnected } = useAccount()
  const isLoading = poolId.isLoading || earnings.isLoading

  return isConnected ? (
    <div className="lg:grid lg:grid-rows-2">
      <div>
        <Skeleton isLoading={isLoading}>
          <Currency
            amount={BigNumber.from(earnings.data.earned ?? "0")}
            decimals={token.data?.decimals ?? 18}
            abbreviate
          />
        </Skeleton>
      </div>
      <div className="text-xs max-lg:hidden">
        <Skeleton isLoading={isLoading}>
          <Currency
            amount={earnings.data.earnedUSD ?? 0}
            decimals={2}
            symbol="$"
            abbreviate
          />
        </Skeleton>
      </div>
    </div>
  ) : (
    <div>—</div>
  )
}

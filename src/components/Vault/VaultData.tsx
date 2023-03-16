import { FC } from "react"

import clsxm from "@/lib/clsxm"
import { trpc } from "@/lib/trpc"
import { VaultProps } from "@/lib/types"
import { useVault, useVaultPoolId, useVaultTvl } from "@/hooks/data/vaults"
import useActiveChainId from "@/hooks/useActiveChainId"
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

export const VaultApy: FC<Required<VaultProps>> = (props) => {
  const poolId = useVaultPoolId(props)
  const chainId = useActiveChainId()
  const vaultApr = trpc.vaultApr.useQuery(
    { ...props, id: poolId.data ?? 0, chainId },
    { enabled: poolId.data !== undefined }
  )

  return (
    <Skeleton isLoading={poolId.isLoading || vaultApr.isLoading}>
      <Percentage>{vaultApr.data?.apy ?? 0}</Percentage>
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
  const { data: balance } = useTokenOrNativeBalance({
    address: props.vaultAddress,
  })

  return (
    <div className={clsxm("grid", { "grid-rows-2": !!balance })}>
      <div>
        <AssetBalance address={props.vaultAddress} abbreviate />
      </div>
      {balance && (
        <div className="text-xs">
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

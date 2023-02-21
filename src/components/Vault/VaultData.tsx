import { BigNumber, ethers } from "ethers"
import { FC } from "react"

import { VaultProps } from "@/lib/types"
import { useVaultPoolId, useVaultTvl } from "@/hooks/data"
import useVaultApy from "@/hooks/data/useVaultApy"
import { useVault } from "@/hooks/data/vaults"
import useTokenOrNative from "@/hooks/useTokenOrNative"

import Currency from "@/components/Currency"
import Percentage from "@/components/Percentage"
import Skeleton from "@/components/Skeleton"

export const VaultName: FC<VaultProps> = (props) => {
  const vault = useVault(props)
  return (
    <Skeleton isLoading={vault.isLoading}>
      {vault.isLoading ? "Loading vault..." : vault.data.name}
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
      <Currency symbol="$" abbreviate>
        {tvl.data ?? 0}
      </Currency>
    </Skeleton>
  )
}

export const VaultDepositedLpTokens: FC<VaultProps> = (props) => {
  const vault = useVault(props)
  const lpTokenOrAsset = useTokenOrNative({ address: props.asset })
  const formatted = ethers.utils.formatUnits(
    BigNumber.from(vault.data.totalAssets ?? 0),
    lpTokenOrAsset.data?.decimals ?? 18
  )

  return (
    <Skeleton isLoading={vault.isLoading || lpTokenOrAsset.isLoading}>
      <Currency abbreviate>{formatted}</Currency>
    </Skeleton>
  )
}

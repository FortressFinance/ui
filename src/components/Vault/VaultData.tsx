import { BigNumber, ethers } from "ethers"
import { FC } from "react"
import { useToken } from "wagmi"

import {
  useVaultDepositedTokens,
  useVaultId,
  useVaultName,
  useVaultTotalApr,
  useVaultTvl,
} from "@/hooks/data"
import { VaultProps } from "@/hooks/types"

import Currency from "@/components/Currency"
import Percentage from "@/components/Percentage"
import Skeleton from "@/components/Skeleton"

export const VaultName: FC<VaultProps> = (props) => {
  const { data: vaultName, isLoading } = useVaultName(props)
  return (
    <Skeleton isLoading={isLoading}>
      {isLoading ? "Loading vault..." : vaultName}
    </Skeleton>
  )
}

export const VaultApr: FC<VaultProps> = (props) => {
  const { data: poolId, isLoading: isLoadingId } = useVaultId(props)

  const { data: totalApr, isLoading } = useVaultTotalApr({
    ...props,
    poolId,
  })

  return (
    <Skeleton isLoading={isLoadingId || isLoading}>
      <Percentage>{totalApr ?? 0}</Percentage>
    </Skeleton>
  )
}

export const VaultTvl: FC<VaultProps> = (props) => {
  const { data: poolId, isLoading: isLoadingId } = useVaultId(props)
  const { data: tvl, isLoading } = useVaultTvl({
    ...props,
    poolId,
  })

  return (
    <Skeleton isLoading={isLoadingId || isLoading}>
      <Currency symbol="$" abbreviate>
        {tvl ?? 0}
      </Currency>
    </Skeleton>
  )
}

export const VaultDepositedLp: FC<VaultProps> = (props) => {
  const { data: poolId, isLoading: isLoadingId } = useVaultId(props)
  const { data: depositedTokens, isLoading: isLoadingDepositedTokens } =
    useVaultDepositedTokens({
      ...props,
      poolId,
    })
  const { data: lpToken, isLoading: isLoadingLpToken } = useToken({
    address: props.asset,
  })
  const formatted = ethers.utils.formatUnits(
    BigNumber.from(depositedTokens ?? 0),
    lpToken?.decimals ?? 18
  )

  return (
    <Skeleton
      isLoading={isLoadingId || isLoadingDepositedTokens || isLoadingLpToken}
    >
      <Currency abbreviate>{formatted}</Currency>
    </Skeleton>
  )
}

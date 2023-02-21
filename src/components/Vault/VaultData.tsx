import { BigNumber, ethers } from "ethers"
import { FC } from "react"
import { useToken } from "wagmi"

import { VaultProps } from "@/lib/types"
import {
  useVaultDepositedAssets,
  useVaultPoolId,
  useVaultTvl,
} from "@/hooks/data"
import { useCompounder } from "@/hooks/data/compounders"
import useVaultApy from "@/hooks/data/useVaultApy"
import useActiveChainId from "@/hooks/useActiveChainId"

import Currency from "@/components/Currency"
import Percentage from "@/components/Percentage"
import Skeleton from "@/components/Skeleton"

export const VaultName: FC<VaultProps> = (props) => {
  const { data: compounder, isLoading } = useCompounder(props)
  return (
    <Skeleton isLoading={isLoading}>
      {isLoading ? "Loading vault..." : compounder.name}
    </Skeleton>
  )
}

export const VaultApy: FC<VaultProps> = (props) => {
  const { data: poolId, isLoading: isLoadingId } = useVaultPoolId(props)
  const { data: totalApy, isLoading } = useVaultApy({
    ...props,
    poolId,
  })

  return (
    <Skeleton isLoading={isLoadingId || isLoading}>
      <Percentage>{totalApy ?? 0}</Percentage>
    </Skeleton>
  )
}

export const VaultTvl: FC<VaultProps> = (props) => {
  const { data: poolId, isLoading: isLoadingId } = useVaultPoolId(props)
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

export const VaultDepositedLpTokens: FC<VaultProps> = (props) => {
  const chainId = useActiveChainId()
  const { data: poolId, isLoading: isLoadingId } = useVaultPoolId(props)
  const { data: depositedTokens, isLoading: isLoadingDepositedTokens } =
    useVaultDepositedAssets({
      ...props,
      poolId,
    })
  const { data: lpTokenOrAsset, isLoading: isLoadingLpTokenOrAsset } = useToken(
    {
      chainId,
      address: props.asset,
    }
  )
  const formatted = ethers.utils.formatUnits(
    BigNumber.from(depositedTokens ?? 0),
    lpTokenOrAsset?.decimals ?? 18
  )

  return (
    <Skeleton
      isLoading={
        isLoadingId || isLoadingDepositedTokens || isLoadingLpTokenOrAsset
      }
    >
      <Currency abbreviate>{formatted}</Currency>
    </Skeleton>
  )
}

import { BigNumber, ethers } from "ethers"
import { FC } from "react"
import { useToken } from "wagmi"

import { VaultProps } from "@/lib/types"
import {
  useVaultName,
  useVaultPoolId,
  useVaultTotalApr,
  useVaultTvl,
} from "@/hooks/data"
import useVaultApy from "@/hooks/data/useVaultApy"
import useActiveChainId from "@/hooks/useActiveChainId"
import useTokenOrNativeBalance from "@/hooks/useTokenOrNativeBalance"

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

export const VaultApr: FC<VaultProps> = (props) => {
  const { data: poolId, isLoading: isLoadingId } = useVaultPoolId(props)
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
  const { data: lpTokenOrAsset, isLoading: isLoadingLpTokenOrAsset } = useToken(
    {
      chainId,
      address: props.asset,
    }
  )
  const {
    data: inputTokenShare,
    isLoading: isLoadingInputTokenShare,
  } = useTokenOrNativeBalance({ address: lpTokenOrAsset?.address })

  const formatted = ethers.utils.formatUnits(
    BigNumber.from(inputTokenShare?.value ?? 0),
    lpTokenOrAsset?.decimals ?? 18
  )

  return (
    <Skeleton
      isLoading={
        isLoadingInputTokenShare || isLoadingLpTokenOrAsset
      }
    >
      <Currency abbreviate>{formatted}</Currency>
    </Skeleton>
  )
}

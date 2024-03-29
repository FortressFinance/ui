import { FC } from "react"
import { Address, useAccount } from "wagmi"

import { formatCurrencyUnits, formatUsd } from "@/lib/helpers/formatCurrency"
import {
  useTokenOrNative,
  useTokenOrNativeBalance,
  useTokenPriceUsd,
} from "@/hooks"

import Skeleton from "@/components/Skeleton"

export type AssetDetailsProps = {
  address: Address | undefined
  chainId?: number
  isLoading?: boolean
}

export const AssetSymbol: FC<AssetDetailsProps> = ({
  address,
  chainId,
  isLoading,
}) => {
  const { data: token, isLoading: isLoadingToken } = useTokenOrNative({
    address,
    chainId,
  })
  return (
    <Skeleton isLoading={isLoading || isLoadingToken}>
      {address ? token?.symbol ?? "Unknown" : "???"}
    </Skeleton>
  )
}

export const AssetName: FC<AssetDetailsProps> = ({
  address,
  chainId,
  isLoading,
}) => {
  const { data: token, isLoading: isLoadingToken } = useTokenOrNative({
    address,
    chainId,
  })
  const re = /(\(arb1\))/gi
  const tokenName = token?.name ?? "Loading..."
  const updatedTokenName = tokenName.replace(re, "")
  return (
    <Skeleton isLoading={isLoading || isLoadingToken}>
      {address ? updatedTokenName : "Unknown token"}
    </Skeleton>
  )
}

type AssetBalanceProps = AssetDetailsProps & {
  maximumFractionDigits?: number
}

export const AssetBalance: FC<AssetBalanceProps> = ({
  address,
  chainId,
  maximumFractionDigits,
}) => {
  const { isConnected } = useAccount()
  const { data: balance, isLoading } = useTokenOrNativeBalance({
    address,
    chainId,
  })
  return (
    <Skeleton isLoading={isLoading}>
      {isConnected
        ? formatCurrencyUnits({
            amountWei: balance?.value?.toString(),
            decimals: balance?.decimals,
            maximumFractionDigits,
          })
        : "—"}
    </Skeleton>
  )
}

type AssetBalanceUsdProps = AssetDetailsProps & {
  asset?: Address
  abbreviate?: boolean
}

export const AssetBalanceUsd: FC<AssetBalanceUsdProps> = ({
  asset,
  address,
  abbreviate,
  chainId,
}) => {
  const { isConnected } = useAccount()
  const { data: balance, isLoading } = useTokenOrNativeBalance({
    address,
    chainId,
  })
  const { data: tokenPriceUsd, isLoading: isLoadingTokenPriceUsd } =
    useTokenPriceUsd({ asset })
  return (
    <Skeleton isLoading={isLoading || isLoadingTokenPriceUsd}>
      {address && isConnected
        ? formatUsd({
            abbreviate,
            amount: Number(balance?.formatted ?? "0") * (tokenPriceUsd ?? 0),
          })
        : "—"}
    </Skeleton>
  )
}

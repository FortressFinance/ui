import { FC } from "react"
import { Address, useAccount } from "wagmi"

import { formatCurrencyUnits, formatUsd } from "@/lib/helpers/formatCurrency"
import {
  useTokenOrNative,
  useTokenOrNativeBalance,
  useTokenPriceUsd,
} from "@/hooks"
import { useConcentratorTokenPriceUsd } from "@/hooks/useConcentratorTokenPriceUsd"

import Skeleton from "@/components/Skeleton"

export type AssetDetailsProps = {
  address: Address | undefined
  isLoading?: boolean
}

export const AssetSymbol: FC<AssetDetailsProps> = ({ address, isLoading }) => {
  const { data: token, isLoading: isLoadingToken } = useTokenOrNative({
    address,
  })
  return (
    <Skeleton isLoading={isLoading || isLoadingToken}>
      {address ? token?.symbol ?? "Unknown" : "???"}
    </Skeleton>
  )
}

export const AssetName: FC<AssetDetailsProps> = ({ address, isLoading }) => {
  const { data: token, isLoading: isLoadingToken } = useTokenOrNative({
    address,
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
  abbreviate?: boolean
}

export const AssetBalance: FC<AssetBalanceProps> = ({
  address,
  abbreviate,
}) => {
  const { isConnected } = useAccount()
  const { data: balance, isLoading } = useTokenOrNativeBalance({ address })
  return (
    <Skeleton isLoading={isLoading}>
      {isConnected
        ? formatCurrencyUnits({
            abbreviate,
            amountWei: balance?.value?.toString(),
            decimals: balance?.decimals,
          })
        : "—"}
    </Skeleton>
  )
}

type AssetBalanceUsdProps = AssetBalanceProps & {
  tokenPriceUsd:
    | ReturnType<typeof useTokenPriceUsd>
    | ReturnType<typeof useConcentratorTokenPriceUsd>
}

export const AssetBalanceUsd: FC<AssetBalanceUsdProps> = ({
  address,
  abbreviate,
  tokenPriceUsd,
}) => {
  const { data: balance, isLoading } = useTokenOrNativeBalance({ address })
  return (
    <Skeleton isLoading={isLoading || tokenPriceUsd.isLoading}>
      {address
        ? formatUsd({
            abbreviate,
            amount:
              Number(balance?.formatted ?? "0") * (tokenPriceUsd.data ?? 0),
          })
        : "—"}
    </Skeleton>
  )
}

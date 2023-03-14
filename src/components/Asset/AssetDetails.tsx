import { BigNumber } from "ethers"
import { FC } from "react"
import { Address, useAccount } from "wagmi"

import { useGetDollarValue } from "@/hooks/data/vaults/fallbacks/pricer/useGetDollarValue"
import useTokenOrNative from "@/hooks/useTokenOrNative"
import useTokenOrNativeBalance from "@/hooks/useTokenOrNativeBalance"
import { useClientReady } from "@/hooks/util"

import Currency, { CurrencyProps } from "@/components/Currency"
import Skeleton from "@/components/Skeleton"

export type AssetDetailsProps = {
  address: Address | undefined
  isLoading?: boolean
}

export const AssetSymbol: FC<AssetDetailsProps> = ({ address, isLoading }) => {
  const isReady = useClientReady()
  const { data: token, isLoading: isLoadingToken } = useTokenOrNative({
    address,
  })
  return (
    <Skeleton isLoading={isLoading || isLoadingToken || !isReady}>
      {isReady
        ? address
          ? token?.symbol ?? "Loading..."
          : "???"
        : "Loading..."}
    </Skeleton>
  )
}

export const AssetName: FC<AssetDetailsProps> = ({ address, isLoading }) => {
  const isReady = useClientReady()
  const { data: token, isLoading: isLoadingToken } = useTokenOrNative({
    address,
  })
  const re = /(\(arb1\))/gi
  const tokenName = token?.name ?? "Loading..."
  const updatedTokenName = tokenName.replace(re, "")
  return (
    <Skeleton isLoading={isLoading || isLoadingToken || !isReady}>
      {isReady ? (address ? updatedTokenName : "Unknown token") : "Loading..."}
    </Skeleton>
  )
}

type AssetBalanceProps = AssetDetailsProps &
  Partial<Pick<CurrencyProps, "abbreviate">>

type AssetBalanceUsdProps = AssetBalanceProps & {
  asset?: Address | undefined
}

export const AssetBalance: FC<AssetBalanceProps> = ({
  address,
  abbreviate,
}) => {
  const isReady = useClientReady()
  const { isConnected } = useAccount()
  const { data: balance, isLoading } = useTokenOrNativeBalance({ address })
  return (
    <Skeleton isLoading={isLoading || !isReady}>
      {!isReady || !isConnected || !address ? (
        <>N/A</>
      ) : (
        <Currency
          amount={balance?.value ?? BigNumber.from(0)}
          decimals={balance?.decimals ?? 18}
          abbreviate={abbreviate}
        />
      )}
    </Skeleton>
  )
}

export const AssetBalanceUsd: FC<AssetBalanceUsdProps> = ({
  asset,
  address,
  abbreviate,
}) => {
  const isReady = useClientReady()
  const { isConnected } = useAccount()
  const { data: balance, isLoading } = useTokenOrNativeBalance({ address })

  const { data: balanceUsd, isLoading: isLoadingBalanceUsd } =
    useGetDollarValue({
      asset,
      amount: balance === undefined ? "0" : balance.formatted,
    })

  const balanceUsdNumber = Number(balanceUsd ?? 0)

  return (
    <Skeleton isLoading={isLoading || isLoadingBalanceUsd || !isReady}>
      {!isReady || !isConnected || !address ? (
        <>N/A</>
      ) : (
        <Currency
          amount={isNaN(balanceUsdNumber) ? 0 : balanceUsdNumber}
          decimals={2}
          symbol="$"
          abbreviate={abbreviate}
        />
      )}
    </Skeleton>
  )
}

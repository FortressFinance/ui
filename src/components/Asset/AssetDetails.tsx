import { BigNumber } from "ethers"
import { FC } from "react"
import { Address, useAccount } from "wagmi"

import {
  useClientReady,
  useTokenOrNative,
  useTokenOrNativeBalance,
  useTokenPriceUsd,
} from "@/hooks"

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
        <>—</>
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
  const { data: tokenPriceUsd, isLoading: isLoadingTokenPriceUsd } =
    useTokenPriceUsd({ asset })
  return (
    <Skeleton isLoading={isLoading || isLoadingTokenPriceUsd || !isReady}>
      {!isReady || !isConnected || !address ? (
        <>—</>
      ) : (
        <Currency
          amount={Number(balance?.formatted ?? "0") * (tokenPriceUsd ?? 0)}
          decimals={2}
          symbol="$"
          abbreviate={abbreviate}
        />
      )}
    </Skeleton>
  )
}

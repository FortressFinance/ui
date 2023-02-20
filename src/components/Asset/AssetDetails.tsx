import { FC } from "react"
import { Address } from "wagmi"

import useTokenOrNative from "@/hooks/useTokenOrNative"
import useTokenOrNativeBalance from "@/hooks/useTokenOrNativeBalance"
import { useClientReady } from "@/hooks/util/useClientReady"

import Skeleton from "@/components/Skeleton"

export type AssetDetailsProps = {
  address: Address | undefined
}

export const AssetSymbol: FC<AssetDetailsProps> = ({ address }) => {
  const isReady = useClientReady()
  const { data: token, isLoading } = useTokenOrNative({ address })
  return (
    <Skeleton isLoading={!address || isLoading || !isReady}>
      {isReady && token?.symbol ? token.symbol : "Loading..."}
    </Skeleton>
  )
}

export const AssetBalance: FC<AssetDetailsProps> = ({ address }) => {
  const isReady = useClientReady()
  const { data: balance, isLoading } = useTokenOrNativeBalance({ address })
  return (
    <Skeleton isLoading={!address || isLoading || !isReady}>
      {isReady && balance?.formatted ? balance.formatted : "0.0"}
    </Skeleton>
  )
}

import { FC } from "react"

import useTokenOrNative from "@/hooks/useTokenOrNative"
import useTokenOrNativeBalance from "@/hooks/useTokenOrNativeBalance"
import { useClientReady } from "@/hooks/util/useClientReady"

import { AssetProps } from "@/components/Asset/types"
import Skeleton from "@/components/Skeleton"

export const AssetSymbol: FC<AssetProps> = ({ address }) => {
  const isReady = useClientReady()
  const { data: token, isLoading } = useTokenOrNative({ address })
  return (
    <Skeleton isLoading={!address || isLoading || !isReady}>
      {isReady && token?.symbol ? token.symbol : "Loading..."}
    </Skeleton>
  )
}

export const AssetBalance: FC<AssetProps> = ({ address }) => {
  const isReady = useClientReady()
  const { data: balance, isLoading } = useTokenOrNativeBalance({ address })
  return (
    <Skeleton isLoading={!address || isLoading || !isReady}>
      {isReady && balance?.formatted ? balance.formatted : "0.0"}
    </Skeleton>
  )
}

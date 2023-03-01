import { FC } from "react"
import { Address, useAccount } from "wagmi"

import useTokenOrNative from "@/hooks/useTokenOrNative"
import useTokenOrNativeBalance from "@/hooks/useTokenOrNativeBalance"
import { useClientReady } from "@/hooks/util"

import Currency from "@/components/Currency"
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

export const AssetBalance: FC<AssetDetailsProps> = ({ address }) => {
  const isReady = useClientReady()
  const { isConnected } = useAccount()
  const { data: balance, isLoading } = useTokenOrNativeBalance({ address })
  return (
    <Skeleton isLoading={isLoading || !isReady}>
      {!isReady || !isConnected || !address ? (
        <>N/A</>
      ) : (
        <Currency abbreviate>{balance?.formatted ?? "0.0"}</Currency>
      )}
    </Skeleton>
  )
}

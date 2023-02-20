import { FC } from "react"
import { Address } from "wagmi"

import useTokenOrNative from "@/hooks/useTokenOrNative"
import { useClientReady } from "@/hooks/util/useClientReady"

import Skeleton from "@/components/Skeleton"

type AssetSymbolProps = {
  assetAddress: Address | undefined
}

export const AssetSymbol: FC<AssetSymbolProps> = ({
  assetAddress: address,
}) => {
  const isReady = useClientReady()
  const { data: token, isLoading } = useTokenOrNative({ address })
  return (
    <Skeleton isLoading={!address || isLoading || !isReady}>
      {isReady && token?.symbol ? token.symbol : "Loading..."}
    </Skeleton>
  )
}

import { FC } from "react"
import { Address } from "wagmi"

import useTokenOrNative from "@/hooks/useTokenOrNative"

import Skeleton from "@/components/Skeleton"

type TokenSymbolProps = {
  address: Address
}

const TokenSymbol: FC<TokenSymbolProps> = ({ address }) => {
  const { data: token, isLoading } = useTokenOrNative({ address })

  return (
    <Skeleton isLoading={isLoading}>
      {isLoading ? "XXXX" : token?.symbol ?? "unknown token"}
    </Skeleton>
  )
}

export default TokenSymbol

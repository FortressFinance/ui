import { FC } from "react"

import { useLendingPair } from "@/hooks"

import { AssetSymbol } from "@/components/Asset"

import { LendingPair } from "@/constant"

export const LendingPairAsset: FC<LendingPair> = ({ pairAddress, chainId }) => {
  const lendingPair = useLendingPair({ pairAddress, chainId })
  return (
    <AssetSymbol address={lendingPair.data?.assetContract} chainId={chainId} />
  )
}

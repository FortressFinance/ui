import { FC } from "react"

import { formatPercentage } from "@/lib/helpers"
import { usePairLeverParams } from "@/hooks"

import Skeleton from "@/components/Skeleton"

import { LendingPair } from "@/constant"

export const LendingPairAPY: FC<LendingPair> = ({ pairAddress, chainId }) => {
  const pairLeverParams = usePairLeverParams({ pairAddress, chainId })
  return (
    <Skeleton isLoading={pairLeverParams.isLoading} loadingText="...">
      {formatPercentage("0")}
    </Skeleton>
  )
}

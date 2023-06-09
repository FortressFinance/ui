import { FC } from "preact/compat"

import { calculateUtilizationRate } from "@/lib"
import { formatPercentage } from "@/lib/helpers"
import { useLeverPair } from "@/hooks"

import Skeleton from "@/components/Skeleton"

import { LendingPair } from "@/constant"

export const LendingPairUtilization: FC<LendingPair> = ({
  pairAddress,
  chainId,
}) => {
  const leverPair = useLeverPair({ pairAddress, chainId })
  const utilizationRate = calculateUtilizationRate({
    totalAssets: leverPair.data.totalAssets,
    totalBorrowAmount: leverPair.data.totalBorrowAmount,
    utilPrecision: leverPair.data.constants?.utilPrecision,
  })
  return (
    <Skeleton isLoading={leverPair.isLoading} loadingText="...">
      {formatPercentage(utilizationRate.toString())}
    </Skeleton>
  )
}

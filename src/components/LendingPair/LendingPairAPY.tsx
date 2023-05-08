import { FC } from "react"

import {
  calculateBorrowAPY,
  calculateLendAPY,
  calculateUtilizationRate,
} from "@/lib"
import { formatPercentage } from "@/lib/helpers"
import { usePairLeverParams } from "@/hooks"

import Skeleton from "@/components/Skeleton"

import { LendingPair } from "@/constant"

export const LendingPairAPY: FC<LendingPair> = ({ pairAddress, chainId }) => {
  const pairLeverParams = usePairLeverParams({ pairAddress, chainId })
  const utilizationRate = calculateUtilizationRate({
    totalAssets: pairLeverParams.data.totalAssets,
    totalBorrowAmount: pairLeverParams.data.totalBorrowAmount,
    utilPrecision: pairLeverParams.data.constants?.utilPrecision,
  })
  const borrowAPY = calculateBorrowAPY({
    interestRatePerSecond: pairLeverParams.data.interestRatePerSecond,
  })
  const lendAPY = calculateLendAPY({ borrowAPY, utilizationRate })
  return (
    <Skeleton isLoading={pairLeverParams.isLoading} loadingText="...">
      {formatPercentage(lendAPY.toString())}
    </Skeleton>
  )
}

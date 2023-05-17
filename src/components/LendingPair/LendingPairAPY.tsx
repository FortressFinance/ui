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

export type LendingPairAPYType = "borrow" | "lend"

type LendingPairAPYProps = LendingPair & {
  apyType: LendingPairAPYType
}

export const LendingPairAPY: FC<LendingPairAPYProps> = ({
  apyType,
  ...lendingPair
}) => {
  const pairLeverParams = usePairLeverParams(lendingPair)
  const borrowAPY = calculateBorrowAPY({
    interestRatePerSecond: pairLeverParams.data.interestRatePerSecond,
  })

  if (apyType === "borrow") {
    return (
      <Skeleton isLoading={pairLeverParams.isLoading} loadingText="...">
        {formatPercentage(borrowAPY.toString())}
      </Skeleton>
    )
  }

  const utilizationRate = calculateUtilizationRate({
    totalAssets: pairLeverParams.data.totalAssets,
    totalBorrowAmount: pairLeverParams.data.totalBorrowAmount,
    utilPrecision: pairLeverParams.data.constants?.utilPrecision,
  })
  const lendAPY = calculateLendAPY({ borrowAPY, utilizationRate })

  return (
    <Skeleton isLoading={pairLeverParams.isLoading} loadingText="...">
      {formatPercentage(lendAPY.toString())}
    </Skeleton>
  )
}

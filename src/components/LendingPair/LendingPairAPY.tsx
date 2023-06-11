import { FC } from "react"

import {
  calculateBorrowAPY,
  calculateLendAPY,
  calculateUtilizationRate,
} from "@/lib"
import { formatPercentage } from "@/lib/helpers"
import { useLeverPair } from "@/hooks"

import Skeleton from "@/components/Skeleton"

import { LendingPair } from "@/constant"

export type LendingPairInterestType = "borrow" | "lend"

type LendingPairAPYProps = LendingPair & {
  interestType: LendingPairInterestType
}

export const LendingPairAPY: FC<LendingPairAPYProps> = ({
  interestType,
  ...lendingPair
}) => {
  const leverPair = useLeverPair(lendingPair)
  const borrowAPY = calculateBorrowAPY({
    interestRatePerSecond: leverPair.data.interestRatePerSecond,
  })

  if (interestType === "borrow") {
    return (
      <Skeleton isLoading={leverPair.isLoading} loadingText="...">
        {formatPercentage(borrowAPY.toString())}
      </Skeleton>
    )
  }

  const utilizationRate = calculateUtilizationRate({
    totalAssets: leverPair.data.totalAssets,
    totalBorrowAmount: leverPair.data.totalBorrowAmount,
    utilPrecision: leverPair.data.constants?.utilPrecision,
  })
  const lendAPY = calculateLendAPY({ borrowAPY, utilizationRate })

  return (
    <Skeleton isLoading={leverPair.isLoading} loadingText="...">
      {formatPercentage(lendAPY.toString())}
    </Skeleton>
  )
}

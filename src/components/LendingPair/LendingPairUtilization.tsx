import { FC } from "preact/compat"

import { calculateUtilizationRate } from "@/lib"
import { formatPercentage } from "@/lib/helpers"
import { usePairLeverParams } from "@/hooks"

import Skeleton from "@/components/Skeleton"

import { LendingPair } from "@/constant"

export const LendingPairUtilization: FC<LendingPair> = ({
  pairAddress,
  chainId,
}) => {
  const pairLeverParams = usePairLeverParams({ pairAddress, chainId })
  const utilizationRate = calculateUtilizationRate({
    totalAssets: pairLeverParams.data.totalAssets,
    totalBorrowAmount: pairLeverParams.data.totalBorrowAmount,
    utilPrecision: pairLeverParams.data.constants?.utilPrecision,
  })
  return (
    <Skeleton isLoading={pairLeverParams.isLoading} loadingText="...">
      {formatPercentage(utilizationRate.toString())}
    </Skeleton>
  )
}

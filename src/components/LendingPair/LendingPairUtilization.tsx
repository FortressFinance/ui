import { FC } from "preact/compat"

import { formatPercentage } from "@/lib/helpers"
import { usePairLeverParams } from "@/hooks"

import Skeleton from "@/components/Skeleton"

import { LendingPair } from "@/constant"

export const LendingPairUtilization: FC<LendingPair> = ({
  pairAddress,
  chainId,
}) => {
  const pairLeverParams = usePairLeverParams({ pairAddress, chainId })
  return (
    <Skeleton isLoading={pairLeverParams.isLoading} loadingText="...">
      {formatPercentage(
        pairLeverParams.data.totalBorrowAmount
          ?.mul(pairLeverParams.data.constants?.utilPrecision ?? 0)
          .div(pairLeverParams.data.totalAssets ?? 0)
          .toString()
      )}
    </Skeleton>
  )
}

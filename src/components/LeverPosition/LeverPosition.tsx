import { FC } from "react"
import { Address } from "wagmi"

import { calculateLTV } from "@/lib"
import { useLeverPosition, useTokenOrNative } from "@/hooks"

import Skeleton from "@/components/Skeleton"

type LeverPositionProps = {
  pairAddress: Address
}

export const LeverPosition: FC<LeverPositionProps> = ({ pairAddress }) => {
  const leverPosition = useLeverPosition({ pairAddress })
  const share = useTokenOrNative({ address: pairAddress })

  const ltv = calculateLTV({
    borrowedAmount: leverPosition.data.borrowedAmount,
    collateralAmount: leverPosition.data.collateralAmount,
    exchangeRate: leverPosition.data.exchangeRate,
    exchangePrecision: leverPosition.data.constants?.exchangePrecision,
    ltvPrecision: leverPosition.data.constants?.ltvPrecision,
  })

  return (
    <div className="rounded-lg bg-pink-900/80 p-3 backdrop-blur-md lg:p-6">
      <h1>
        <Skeleton isLoading={share.isLoading}>
          {share.data?.name ?? "Loading lending pair..."}
        </Skeleton>
      </h1>
      <div className="mt-6 gap-4">
        <p>LTV: {ltv.toString()}</p>
        <p>Borrowed amount: {leverPosition.data.borrowedAmount?.toString()}</p>
        <p>
          Collateral amount: {leverPosition.data.collateralAmount?.toString()}
        </p>
      </div>
    </div>
  )
}

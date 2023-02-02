import { FC } from "react"

import {
  useCompounderPoolBaseApr,
  useCompounderPoolCrvApr,
  useCompounderPoolCvxApr,
  useCompounderPoolExraApr,
  useCompounderPoolTotalApr,
} from "@/hooks/data/useCompounderPoolApy"
import useCompounderPoolId from "@/hooks/data/useCompounderPoolId"
import { VaultProps } from "@/hooks/types"

import Percentage from "@/components/Percentage"
import Skeleton from "@/components/Skeleton"

export const CurveBalancerApr: FC<VaultProps> = (props) => {
  const { data: poolId, isLoading: isLoadingId } = useCompounderPoolId(props)
  const { data: totalApr, isLoading: isLoadingTotalApr } =
    useCompounderPoolTotalApr({
      ...props,
      poolId,
    })
  const { data: baseApr, isLoading: isLoadingBaseApr } =
    useCompounderPoolBaseApr({
      ...props,
      poolId,
    })
  const { data: crvApr, isLoading: isLoadingCrvApr } = useCompounderPoolCrvApr({
    ...props,
    poolId,
  })
  const { data: cvxApr, isLoading: isLoadingCvxApr } = useCompounderPoolCvxApr({
    ...props,
    poolId,
  })
  const { data: extraRewardsApr, isLoading: isLoadingExtraRewardsApr } =
    useCompounderPoolExraApr({
      ...props,
      poolId,
    })
  const noData =
    totalApr === undefined &&
    baseApr === undefined &&
    crvApr === undefined &&
    cvxApr === undefined &&
    extraRewardsApr === undefined
  return (
    <>
      {totalApr !== undefined && (
        <>
          <dt>Total APR</dt>
          <dd className="text-right">
            <Skeleton isLoading={isLoadingId || isLoadingTotalApr}>
              <Percentage>{totalApr}</Percentage>
            </Skeleton>
          </dd>
        </>
      )}
      {baseApr !== undefined && (
        <>
          <dt>Base APR</dt>
          <dd className="text-right">
            <Skeleton isLoading={isLoadingId || isLoadingBaseApr}>
              <Percentage>{baseApr}</Percentage>
            </Skeleton>
          </dd>
        </>
      )}
      {crvApr !== undefined && (
        <>
          <dt>CRV APR</dt>
          <dd className="text-right">
            <Skeleton isLoading={isLoadingId || isLoadingCrvApr}>
              <Percentage>{crvApr}</Percentage>
            </Skeleton>
          </dd>
        </>
      )}
      {cvxApr !== undefined && (
        <>
          <dt>CVX APR</dt>
          <dd className="text-right">
            <Skeleton isLoading={isLoadingId || isLoadingCvxApr}>
              <Percentage>{cvxApr}</Percentage>
            </Skeleton>
          </dd>
        </>
      )}
      {extraRewardsApr !== undefined && (
        <>
          <dt>Extra Rewards APR</dt>
          <dd className="text-right">
            <Skeleton isLoading={isLoadingId || isLoadingExtraRewardsApr}>
              <Percentage>{extraRewardsApr}</Percentage>
            </Skeleton>
          </dd>
        </>
      )}
      {noData && <div>No data</div>}
    </>
  )
}

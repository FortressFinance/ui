import { FC } from "react"

import { VaultProps } from "@/lib/types"
import {
  useVaultBaseApr,
  useVaultCrvApr,
  useVaultCvxApr,
  useVaultExtraApr,
  useVaultPoolId,
  useVaultTotalApr,
} from "@/hooks/data/vaults"

import Percentage from "@/components/Percentage"
import Skeleton from "@/components/Skeleton"

export const CurveBalancerApr: FC<VaultProps> = (props) => {
  const { data: poolId, isLoading: isLoadingId } = useVaultPoolId(props)
  const { data: totalApr, isLoading: isLoadingTotalApr } = useVaultTotalApr({
    ...props,
    poolId,
  })
  const { data: baseApr, isLoading: isLoadingBaseApr } = useVaultBaseApr({
    ...props,
    poolId,
  })
  const { data: crvApr, isLoading: isLoadingCrvApr } = useVaultCrvApr({
    ...props,
    poolId,
  })
  const { data: cvxApr, isLoading: isLoadingCvxApr } = useVaultCvxApr({
    ...props,
    poolId,
  })
  const { data: extraRewardsApr, isLoading: isLoadingExtraRewardsApr } =
    useVaultExtraApr({
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
          <dt className="align-bottom text-base font-semibold">Total APR</dt>
          <dd className="text-right align-bottom text-base font-semibold">
            <Skeleton isLoading={isLoadingId || isLoadingTotalApr}>
              <Percentage>{totalApr}</Percentage>
            </Skeleton>
          </dd>
        </>
      )}
      {baseApr !== undefined && (
        <>
          <dt className="my-auto align-bottom">Base APR</dt>
          <dd className="my-auto text-right align-bottom">
            <Skeleton isLoading={isLoadingId || isLoadingBaseApr}>
              <Percentage>{baseApr}</Percentage>
            </Skeleton>
          </dd>
        </>
      )}
      {crvApr !== undefined && (
        <>
          <dt className="my-auto align-bottom">CRV APR</dt>
          <dd className="my-auto text-right align-bottom">
            <Skeleton isLoading={isLoadingId || isLoadingCrvApr}>
              <Percentage>{crvApr}</Percentage>
            </Skeleton>
          </dd>
        </>
      )}
      {cvxApr !== undefined && (
        <>
          <dt className="my-auto align-bottom">CVX APR</dt>
          <dd className="my-auto text-right align-bottom">
            <Skeleton isLoading={isLoadingId || isLoadingCvxApr}>
              <Percentage>{cvxApr}</Percentage>
            </Skeleton>
          </dd>
        </>
      )}
      {extraRewardsApr !== undefined && (
        <>
          <dt className="my-auto align-bottom">Extra Rewards APR</dt>
          <dd className="my-auto text-right align-bottom">
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

import { FC } from "react"
import { BiInfoCircle } from "react-icons/bi"

import { VaultProps } from "@/lib/types"
import {
  useVaultApy,
  useVaultBaseApr,
  useVaultCrvApr,
  useVaultCvxApr,
  useVaultExtraApr,
  useVaultPoolId,
  useVaultTotalApr,
} from "@/hooks"

import Percentage from "@/components/Percentage"
import Skeleton from "@/components/Skeleton"
import Tooltip from "@/components/Tooltip"
import { GradientText } from "@/components/Typography"

export const CurveBalancerApr: FC<VaultProps> = (props) => {
  const { data: poolId, isLoading: isLoadingId } = useVaultPoolId(props)
  const { data: totalApy, isLoading: isLoadingTotalApy } = useVaultApy({
    ...props,
    poolId,
  })
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
    totalApy === undefined &&
    totalApr === undefined &&
    baseApr === undefined &&
    crvApr === undefined &&
    cvxApr === undefined &&
    extraRewardsApr === undefined
  return (
    <>
      {totalApy !== undefined && (
        <>
          <dt className="flex items-center gap-1 text-base font-bold">
            <GradientText>Total APY</GradientText>
            <Tooltip label="APY calculation assumes weekly compounding and excludes Fortress fees">
              <span>
                <BiInfoCircle className="h-5 w-5 cursor-pointer" />
              </span>
            </Tooltip>
          </dt>
          <dd className="text-right text-base font-bold">
            <GradientText>
              <Skeleton isLoading={isLoadingId || isLoadingTotalApy}>
                <Percentage>{totalApy}</Percentage>
              </Skeleton>
            </GradientText>
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
      {noData && <div>No data</div>}
    </>
  )
}

import { FC } from "react"

import {
  useVaultAuraApr,
  useVaultBalApr,
  useVaultCrvApr,
  useVaultCvxApr,
  useVaultEthApr,
  useVaultExtraApr,
  useVaultGmxApr,
  useVaultPoolId,
  useVaultTotalApr,
} from "@/hooks/data"
import { VaultProps } from "@/hooks/types"

import Percentage from "@/components/Percentage"
import Skeleton from "@/components/Skeleton"

export const TokenApr: FC<VaultProps> = (props) => {
  const { data: poolId, isLoading: isLoadingId } = useVaultPoolId(props)
  const { data: totalApr, isLoading: isLoadingTotalApr } = useVaultTotalApr({
    ...props,
    poolId,
  })
  const { data: balApr, isLoading: isLoadingBalApr } = useVaultBalApr({
    ...props,
    poolId,
  })
  const { data: AuraApr, isLoading: isLoadingAuraApr } = useVaultAuraApr({
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
  const { data: gmxApr, isLoading: isLoadingGmxApr } = useVaultGmxApr({
    ...props,
    poolId,
  })
  const { data: ethApr, isLoading: isLoadingEthApr } = useVaultEthApr({
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
    balApr === undefined &&
    AuraApr === undefined &&
    crvApr === undefined &&
    cvxApr === undefined &&
    gmxApr === undefined &&
    ethApr === undefined &&
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
      {balApr !== undefined && (
        <>
          <dt>BAL APR</dt>
          <dd className="text-right">
            <Skeleton isLoading={isLoadingId || isLoadingBalApr}>
              <Percentage>{balApr}</Percentage>
            </Skeleton>
          </dd>
        </>
      )}
      {AuraApr !== undefined && (
        <>
          <dt>AURA APR</dt>
          <dd className="text-right">
            <Skeleton isLoading={isLoadingId || isLoadingAuraApr}>
              <Percentage>{AuraApr}</Percentage>
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
      {gmxApr !== undefined && (
        <>
          <dt>GMX APR</dt>
          <dd className="text-right">
            <Skeleton isLoading={isLoadingId || isLoadingGmxApr}>
              <Percentage>{gmxApr}</Percentage>
            </Skeleton>
          </dd>
        </>
      )}
      {ethApr !== undefined && (
        <>
          <dt>ETH APR</dt>
          <dd className="text-right">
            <Skeleton isLoading={isLoadingId || isLoadingEthApr}>
              <Percentage>{ethApr}</Percentage>
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

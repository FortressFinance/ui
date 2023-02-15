import { FC } from "react"

import { VaultProps } from "@/lib/types"
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
          <dt className="font-semibold text-base">Total APR</dt>
          <dd className="text-right font-semibold text-base">
            <Skeleton isLoading={isLoadingId || isLoadingTotalApr}>
              <Percentage>{totalApr}</Percentage>
            </Skeleton>
          </dd>
        </>
      )}
      {balApr !== undefined && (
        <>
          <dt className="align-bottom my-auto">BAL APR</dt>
          <dd className="text-right align-bottom my-auto">
            <Skeleton isLoading={isLoadingId || isLoadingBalApr}>
              <Percentage>{balApr}</Percentage>
            </Skeleton>
          </dd>
        </>
      )}
      {AuraApr !== undefined && (
        <>
          <dt className="align-bottom my-auto">AURA APR</dt>
          <dd className="text-right align-bottom my-auto">
            <Skeleton isLoading={isLoadingId || isLoadingAuraApr}>
              <Percentage>{AuraApr}</Percentage>
            </Skeleton>
          </dd>
        </>
      )}
      {crvApr !== undefined && (
        <>
          <dt className="align-bottom my-auto">CRV APR</dt>
          <dd className="text-right align-bottom my-auto">
            <Skeleton isLoading={isLoadingId || isLoadingCrvApr}>
              <Percentage>{crvApr}</Percentage>
            </Skeleton>
          </dd>
        </>
      )}
      {cvxApr !== undefined && (
        <>
          <dt className="align-bottom my-auto">CVX APR</dt>
          <dd className="text-right align-bottom my-auto">
            <Skeleton isLoading={isLoadingId || isLoadingCvxApr}>
              <Percentage>{cvxApr}</Percentage>
            </Skeleton>
          </dd>
        </>
      )}
      {gmxApr !== undefined && (
        <>
          <dt className="align-bottom my-auto">GMX APR</dt>
          <dd className="text-right align-bottom my-auto">
            <Skeleton isLoading={isLoadingId || isLoadingGmxApr}>
              <Percentage>{gmxApr}</Percentage>
            </Skeleton>
          </dd>
        </>
      )}
      {ethApr !== undefined && (
        <>
          <dt className="align-bottom my-auto">ETH APR</dt>
          <dd className="text-right align-bottom my-auto">
            <Skeleton isLoading={isLoadingId || isLoadingEthApr}>
              <Percentage>{ethApr}</Percentage>
            </Skeleton>
          </dd>
        </>
      )}
      {extraRewardsApr !== undefined && (
        <>
          <dt className="align-bottom my-auto">Extra Rewards APR</dt>
          <dd className="text-right align-bottom my-auto">
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

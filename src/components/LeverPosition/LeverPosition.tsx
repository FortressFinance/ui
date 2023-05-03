import { FC } from "react"

import {
  useClientReady,
  useLendingPair,
  usePairLeverParams,
  useSignificantLeverAmount,
  useTokenOrNative,
  useTokenOrNativeBalance,
} from "@/hooks"

import { AddCollateral } from "@/components/LeverPosition/lib/AddCollateral"
import { CreateLeveredPosition } from "@/components/LeverPosition/lib/CreateLeveredPosition"
import { RemoveCollateral } from "@/components/LeverPosition/lib/RemoveCollateral"
import { RepayAsset } from "@/components/LeverPosition/lib/RepayAsset"
import { RepayAssetWithCollateral } from "@/components/LeverPosition/lib/RepayAssetWithCollateral"
import Skeleton from "@/components/Skeleton"

import { LendingPair } from "@/constant"

export const LeverPosition: FC<LendingPair> = ({ chainId, pairAddress }) => {
  const isClientReady = useClientReady()

  const lendingPair = useLendingPair({ chainId, pairAddress })
  const pairLeverParams = usePairLeverParams({ chainId, pairAddress })
  const share = useTokenOrNative({ address: pairAddress, chainId })

  const borrowAmountSignificant = useSignificantLeverAmount({
    amount: pairLeverParams.data.borrowedAmount,
    assetAddress: lendingPair.data?.assetContract,
  })
  const collateralAmountSignificant = useSignificantLeverAmount({
    amount: pairLeverParams.data.collateralAmount,
    assetAddress: lendingPair.data?.collateralContract,
  })
  const borrowAssetBalance = useTokenOrNativeBalance({
    address: lendingPair.data?.assetContract,
    chainId,
  })
  const collateralAssetBalance = useTokenOrNativeBalance({
    address: lendingPair.data?.collateralContract,
    chainId,
  })

  const onSuccess = () => {
    pairLeverParams.refetch()
    borrowAssetBalance.refetch()
    collateralAssetBalance.refetch()
  }

  return (
    <div className="rounded-lg bg-pink-900/80 p-3 backdrop-blur-md lg:p-6">
      <h1>
        <Skeleton isLoading={share.isLoading}>
          {share.data?.name ?? "Loading lending pair..."}
        </Skeleton>
      </h1>
      <div className="mt-6">
        {isClientReady &&
          (borrowAmountSignificant.gt(0) ||
          collateralAmountSignificant.gt(0) ? (
            <>
              <RepayAsset
                borrowAmountSignificant={borrowAmountSignificant}
                borrowAssetAddress={lendingPair.data?.assetContract}
                borrowAssetBalance={borrowAssetBalance}
                totalBorrowAmount={pairLeverParams.data.totalBorrowAmount}
                totalBorrowShares={pairLeverParams.data.totalBorrowShares}
                pairAddress={pairAddress}
                onSuccess={onSuccess}
              />
              <RepayAssetWithCollateral
                borrowAmountSignificant={borrowAmountSignificant}
                borrowAssetAddress={lendingPair.data?.assetContract}
                collateralAmountSignificant={collateralAmountSignificant}
                collateralAssetBalance={collateralAssetBalance}
                collateralAssetAddress={lendingPair.data?.collateralContract}
                exchangeRate={pairLeverParams.data.exchangeRate}
                exchangePrecision={
                  pairLeverParams.data.constants?.exchangePrecision
                }
                pairAddress={pairAddress}
                onSuccess={onSuccess}
              />
              <AddCollateral
                collateralAssetBalance={collateralAssetBalance}
                collateralAssetAddress={lendingPair.data?.collateralContract}
                pairAddress={pairAddress}
                onSuccess={onSuccess}
              />
              <RemoveCollateral
                collateralAmountSignificant={collateralAmountSignificant}
                collateralAssetBalance={collateralAssetBalance}
                collateralAssetAddress={lendingPair.data?.collateralContract}
                pairAddress={pairAddress}
                onSuccess={onSuccess}
              />
            </>
          ) : (
            <CreateLeveredPosition
              borrowAssetAddress={lendingPair.data?.assetContract}
              collateralAssetBalance={collateralAssetBalance}
              collateralAssetAddress={lendingPair.data?.collateralContract}
              exchangeRate={pairLeverParams.data.exchangeRate}
              exchangePrecision={
                pairLeverParams.data.constants?.exchangePrecision
              }
              ltvPrecision={pairLeverParams.data.constants?.ltvPrecision}
              maxLTV={pairLeverParams.data.maxLTV}
              pairAddress={pairAddress}
              onSuccess={onSuccess}
            />
          ))}
      </div>
    </div>
  )
}

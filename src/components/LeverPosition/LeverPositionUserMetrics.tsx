import { FC } from "react"
import { FiArrowRight } from "react-icons/fi"
import { useAccount } from "wagmi"

import {
  assetToCollateral,
  calculateAvailableCredit,
  calculateLiquidationPrice,
  calculateLTV,
  calculateMaxBorrowAmount,
  collateralToAsset,
  ltvPercentage,
} from "@/lib"
import clsxm from "@/lib/clsxm"
import { formatCurrencyUnits } from "@/lib/helpers"
import {
  useClientReady,
  useLendingPair,
  useLeverPair,
  useTokenOrNative,
} from "@/hooks"

import { AssetSymbol } from "@/components/Asset"
import { GradientText } from "@/components/Typography"

import { LendingPair } from "@/constant"

type LeverPositionUserMetricsProps = LendingPair & {
  estimatedBorrowAmount?: bigint
  estimatedCollateralAmount?: bigint
  borrowAmountSignificant: bigint
  collateralAmountSignificant: bigint
  isUpdatingAmounts: boolean
}

export const LeverPositionUserMetrics: FC<LeverPositionUserMetricsProps> = ({
  estimatedBorrowAmount,
  estimatedCollateralAmount,
  borrowAmountSignificant,
  collateralAmountSignificant,
  isUpdatingAmounts,
  ...props
}) => {
  const isClientReady = useClientReady()
  const { isConnected } = useAccount()
  const lendingPair = useLendingPair({
    chainId: props.chainId,
    pairAddress: props.pairAddress,
  })
  const leverPair = useLeverPair({
    chainId: props.chainId,
    pairAddress: props.pairAddress,
  })
  const borrowAsset = useTokenOrNative({
    chainId: props.chainId,
    address: lendingPair.data?.assetContract,
  })
  const collateralAsset = useTokenOrNative({
    chainId: props.chainId,
    address: lendingPair.data?.collateralContract,
  })

  const [borrowedAmountAsCollateral, estimatedBorrowedAmountAsCollateral] = [
    assetToCollateral(
      borrowAmountSignificant,
      leverPair.data.exchangeRate,
      leverPair.data.constants?.exchangePrecision
    ),
    assetToCollateral(
      estimatedBorrowAmount ?? borrowAmountSignificant,
      leverPair.data.exchangeRate,
      leverPair.data.constants?.exchangePrecision
    ),
  ]
  const [collateralAmountAsAsset, estimatedCollateralAmountAsAsset] = [
    collateralToAsset(
      collateralAmountSignificant,
      leverPair.data.exchangeRate,
      leverPair.data.constants?.exchangePrecision
    ),
    collateralToAsset(
      estimatedCollateralAmount ?? collateralAmountSignificant,
      leverPair.data.exchangeRate,
      leverPair.data.constants?.exchangePrecision
    ),
  ]
  const [maxBorrowAmount, estimatedMaxBorrowAmount] = [
    calculateMaxBorrowAmount({
      collateralAmountAsAsset,
      maxLTV: leverPair.data.maxLTV,
      ltvPrecision: leverPair.data.constants?.ltvPrecision,
    }),
    calculateMaxBorrowAmount({
      collateralAmountAsAsset: estimatedCollateralAmountAsAsset,
      maxLTV: leverPair.data.maxLTV,
      ltvPrecision: leverPair.data.constants?.ltvPrecision,
    }),
  ]
  const [LTV, estimatedLTV] = [
    calculateLTV({
      borrowedAmountAsCollateral,
      collateralAmount: collateralAmountSignificant,
      ltvPrecision: leverPair.data.constants?.ltvPrecision,
    }),
    calculateLTV({
      borrowedAmountAsCollateral: estimatedBorrowedAmountAsCollateral,
      collateralAmount:
        estimatedCollateralAmount ?? collateralAmountSignificant,
      ltvPrecision: leverPair.data.constants?.ltvPrecision,
    }),
  ]
  const [liquidationPrice, estimatedLiquidationPrice] = [
    calculateLiquidationPrice({
      collateralAssetPrice: leverPair.data.collateralAssetPrice,
      ltv: LTV,
      ltvPrecision: leverPair.data.constants?.ltvPrecision,
      maxLTV: leverPair.data.maxLTV,
    }),
    calculateLiquidationPrice({
      collateralAssetPrice: leverPair.data.collateralAssetPrice,
      ltv: estimatedLTV,
      ltvPrecision: leverPair.data.constants?.ltvPrecision,
      maxLTV: leverPair.data.maxLTV,
    }),
  ]
  const [availableCredit, estimatedAvailableCredit] = [
    calculateAvailableCredit({
      borrowedAmount: borrowAmountSignificant,
      maxBorrowAmount,
    }),
    calculateAvailableCredit({
      borrowedAmount: estimatedBorrowAmount ?? borrowAmountSignificant,
      maxBorrowAmount: estimatedMaxBorrowAmount,
    }),
  ]

  return (
    <>
      <h2 className="mb-5 font-display text-2xl lg:text-3xl">Your position</h2>
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3 lg:gap-6">
          <div className="text-sm uppercase text-white/75">LTV</div>
          <div
            className={clsxm("inline-flex gap-2 font-mono lg:text-lg", {
              "animate-pulse": isUpdatingAmounts,
            })}
          >
            {isClientReady && isConnected ? (
              <>
                <span>
                  {ltvPercentage(LTV, leverPair.data.constants?.ltvPrecision)}
                </span>
                {(estimatedBorrowAmount || estimatedCollateralAmount) && (
                  <span className="inline-flex items-center gap-2 font-medium text-orange">
                    <FiArrowRight />
                    <GradientText>
                      {ltvPercentage(
                        estimatedLTV,
                        leverPair.data.constants?.ltvPrecision
                      )}
                    </GradientText>
                  </span>
                )}
              </>
            ) : (
              "—"
            )}
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 lg:gap-6">
          <div className="text-sm uppercase text-white/75">
            Liquidation price
          </div>
          <div
            className={clsxm("inline-flex gap-2 font-mono lg:text-lg", {
              "animate-pulse": isUpdatingAmounts,
            })}
          >
            {isClientReady && isConnected ? (
              <>
                <span>
                  {borrowAmountSignificant
                    ? formatCurrencyUnits({
                        amountWei: liquidationPrice.toString(),
                        decimals: borrowAsset.data?.decimals,
                        maximumFractionDigits: 6,
                      })
                    : "0"}
                </span>
                {(estimatedBorrowAmount || estimatedCollateralAmount) && (
                  <span className="inline-flex items-center gap-2 font-medium text-orange">
                    <FiArrowRight />
                    <GradientText>
                      {formatCurrencyUnits({
                        amountWei: estimatedLiquidationPrice.toString(),
                        decimals: borrowAsset.data?.decimals,
                        maximumFractionDigits: 6,
                      })}
                    </GradientText>
                  </span>
                )}
              </>
            ) : (
              "—"
            )}
            <AssetSymbol
              address={lendingPair.data?.assetContract}
              chainId={props.chainId}
            />
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 lg:gap-6">
          <div className="text-sm uppercase text-white/75">Assets borrowed</div>
          <div
            className={clsxm("inline-flex gap-2 font-mono lg:text-lg", {
              "animate-pulse": isUpdatingAmounts,
            })}
          >
            {isClientReady && isConnected ? (
              <>
                <span>
                  {formatCurrencyUnits({
                    amountWei:
                      leverPair.data.borrowedAmountWithBuffer?.toString(),
                    decimals: borrowAsset.data?.decimals,
                    maximumFractionDigits: 6,
                  })}
                </span>
                {estimatedBorrowAmount && (
                  <span className="inline-flex items-center gap-2 font-medium text-orange">
                    <FiArrowRight />
                    <GradientText>
                      {formatCurrencyUnits({
                        amountWei: estimatedBorrowAmount.toString(),
                        decimals: borrowAsset.data?.decimals,
                        maximumFractionDigits: 6,
                      })}
                    </GradientText>
                  </span>
                )}
              </>
            ) : (
              "—"
            )}
            <AssetSymbol
              address={lendingPair.data?.assetContract}
              chainId={props.chainId}
            />
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 lg:gap-6">
          <div className="text-sm uppercase text-white/75">
            Collateral deposited
          </div>
          <div
            className={clsxm("inline-flex gap-2 font-mono lg:text-lg", {
              "animate-pulse": isUpdatingAmounts,
            })}
          >
            {isClientReady && isConnected ? (
              <>
                <span>
                  {formatCurrencyUnits({
                    amountWei: collateralAmountSignificant?.toString(),
                    decimals: collateralAsset.data?.decimals,
                    maximumFractionDigits: 6,
                  })}
                </span>
                {estimatedCollateralAmount && (
                  <span className="inline-flex items-center gap-2 font-medium text-orange">
                    <FiArrowRight />
                    <GradientText>
                      {formatCurrencyUnits({
                        amountWei: estimatedCollateralAmount
                          ? estimatedCollateralAmount.toString()
                          : collateralAmountSignificant?.toString(),
                        decimals: collateralAsset.data?.decimals,
                        maximumFractionDigits: 6,
                      })}
                    </GradientText>
                  </span>
                )}
              </>
            ) : (
              "—"
            )}
            <AssetSymbol
              address={lendingPair.data?.collateralContract}
              chainId={props.chainId}
            />
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 lg:gap-6">
          <div className="text-sm uppercase text-white/75">
            Available credit
          </div>
          <div
            className={clsxm("inline-flex gap-2 font-mono lg:text-lg", {
              "animate-pulse": isUpdatingAmounts,
            })}
          >
            {isClientReady && isConnected ? (
              <>
                <span>
                  {formatCurrencyUnits({
                    amountWei: availableCredit.toString(),
                    decimals: borrowAsset.data?.decimals,
                    maximumFractionDigits: 6,
                  })}
                </span>
                {(estimatedBorrowAmount || estimatedCollateralAmount) && (
                  <span className="inline-flex items-center gap-2 font-medium text-orange">
                    <FiArrowRight />
                    <GradientText>
                      {formatCurrencyUnits({
                        amountWei: estimatedAvailableCredit.toString(),
                        decimals: borrowAsset.data?.decimals,
                        maximumFractionDigits: 6,
                      })}
                    </GradientText>
                  </span>
                )}
              </>
            ) : (
              "—"
            )}
            <AssetSymbol
              address={lendingPair.data?.assetContract}
              chainId={props.chainId}
            />
          </div>
        </div>
      </div>
    </>
  )
}

import { BigNumber } from "ethers"
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
import { formatCurrencyUnits } from "@/lib/helpers"
import {
  useClientReady,
  useLendingPair,
  usePairLeverParams,
  useTokenOrNative,
} from "@/hooks"

import { AssetSymbol } from "@/components/Asset"
import { GradientText } from "@/components/Typography"

import { LendingPair } from "@/constant"

type LeverPositionUserStatsProps = LendingPair & {
  adjustedBorrowAmount?: BigNumber
  adjustedCollateralAmount?: BigNumber
}

export const LeverPositionUserStats: FC<LeverPositionUserStatsProps> = ({
  adjustedBorrowAmount,
  adjustedCollateralAmount,
  ...props
}) => {
  const isClientReady = useClientReady()
  const { isConnected } = useAccount()
  const lendingPair = useLendingPair({
    chainId: props.chainId,
    pairAddress: props.pairAddress,
  })
  const pairLeverParams = usePairLeverParams({
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

  const [borrowedAmountAsCollateral, adjustedBorrowedAmountAsCollateral] = [
    assetToCollateral(
      pairLeverParams.data.borrowedAmount,
      pairLeverParams.data.exchangeRate,
      pairLeverParams.data.constants?.exchangePrecision
    ),
    assetToCollateral(
      adjustedBorrowAmount ?? pairLeverParams.data.borrowedAmount,
      pairLeverParams.data.exchangeRate,
      pairLeverParams.data.constants?.exchangePrecision
    ),
  ]
  const [collateralAmountAsAsset, adjustedCollateralAmountAsAsset] = [
    collateralToAsset(
      pairLeverParams.data.collateralAmount,
      pairLeverParams.data.exchangeRate,
      pairLeverParams.data.constants?.exchangePrecision
    ),
    collateralToAsset(
      adjustedCollateralAmount ?? pairLeverParams.data.collateralAmount,
      pairLeverParams.data.exchangeRate,
      pairLeverParams.data.constants?.exchangePrecision
    ),
  ]
  const [maxBorrowAmount, adjustedMaxBorrowAmount] = [
    calculateMaxBorrowAmount({
      collateralAmountAsAsset,
      maxLTV: pairLeverParams.data.maxLTV,
      ltvPrecision: pairLeverParams.data.constants?.ltvPrecision,
    }),
    calculateMaxBorrowAmount({
      collateralAmountAsAsset: adjustedCollateralAmountAsAsset,
      maxLTV: pairLeverParams.data.maxLTV,
      ltvPrecision: pairLeverParams.data.constants?.ltvPrecision,
    }),
  ]
  const [LTV, adjustedLTV] = [
    calculateLTV({
      borrowedAmountAsCollateral,
      collateralAmount: pairLeverParams.data.collateralAmount,
      ltvPrecision: pairLeverParams.data.constants?.ltvPrecision,
    }),
    calculateLTV({
      borrowedAmountAsCollateral: adjustedBorrowedAmountAsCollateral,
      collateralAmount:
        adjustedCollateralAmount ?? pairLeverParams.data.collateralAmount,
      ltvPrecision: pairLeverParams.data.constants?.ltvPrecision,
    }),
  ]
  const [liquidationPrice, adjustedLiquidationPrice] = [
    calculateLiquidationPrice({
      borrowedAmount: pairLeverParams.data.borrowedAmount,
      maxBorrowAmount,
      exchangePrecision: pairLeverParams.data.constants?.exchangePrecision,
    }),
    calculateLiquidationPrice({
      borrowedAmount:
        adjustedBorrowAmount ?? pairLeverParams.data.borrowedAmount,
      maxBorrowAmount: adjustedMaxBorrowAmount,
      exchangePrecision: pairLeverParams.data.constants?.exchangePrecision,
    }),
  ]
  const [availableCredit, adjustedAvailableCredit] = [
    calculateAvailableCredit({
      borrowedAmount: pairLeverParams.data.borrowedAmount,
      maxBorrowAmount,
    }),
    calculateAvailableCredit({
      borrowedAmount:
        adjustedBorrowAmount ?? pairLeverParams.data.borrowedAmount,
      maxBorrowAmount: adjustedMaxBorrowAmount,
    }),
  ]

  return (
    <>
      <h2 className="mb-5 font-display text-2xl lg:text-3xl">Your position</h2>
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3 lg:gap-6">
          <div className="text-sm uppercase text-white/75">LTV</div>
          <div className="inline-flex gap-2 font-mono lg:text-lg">
            {isClientReady && isConnected ? (
              <>
                <span>
                  {ltvPercentage(
                    LTV,
                    pairLeverParams.data.constants?.ltvPrecision
                  )}
                </span>
                {(adjustedBorrowAmount || adjustedCollateralAmount) && (
                  <span className="inline-flex items-center gap-2 font-medium text-orange">
                    <FiArrowRight />
                    <GradientText>
                      {ltvPercentage(
                        adjustedLTV,
                        pairLeverParams.data.constants?.ltvPrecision
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
          <div className="inline-flex gap-2 font-mono lg:text-lg">
            {isClientReady && isConnected ? (
              <>
                <span>
                  {formatCurrencyUnits({
                    amountWei: liquidationPrice.toString(),
                    decimals: borrowAsset.data?.decimals,
                    maximumFractionDigits: 6,
                  })}
                </span>
                {(adjustedBorrowAmount || adjustedCollateralAmount) && (
                  <span className="inline-flex items-center gap-2 font-medium text-orange">
                    <FiArrowRight />
                    <GradientText>
                      {formatCurrencyUnits({
                        amountWei: adjustedLiquidationPrice.toString(),
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
          <div className="inline-flex gap-2 font-mono lg:text-lg">
            {isClientReady && isConnected ? (
              <>
                <span>
                  {formatCurrencyUnits({
                    amountWei: pairLeverParams.data.borrowedAmount?.toString(),
                    decimals: borrowAsset.data?.decimals,
                    maximumFractionDigits: 6,
                  })}
                </span>
                {adjustedBorrowAmount && (
                  <span className="inline-flex items-center gap-2 font-medium text-orange">
                    <FiArrowRight />
                    <GradientText>
                      {formatCurrencyUnits({
                        amountWei: adjustedBorrowAmount.toString(),
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
          <div className="inline-flex gap-2 font-mono lg:text-lg">
            {isClientReady && isConnected ? (
              <>
                <span>
                  {formatCurrencyUnits({
                    amountWei:
                      pairLeverParams.data.collateralAmount?.toString(),
                    decimals: collateralAsset.data?.decimals,
                    maximumFractionDigits: 6,
                  })}
                </span>
                {adjustedCollateralAmount && (
                  <span className="inline-flex items-center gap-2 font-medium text-orange">
                    <FiArrowRight />
                    <GradientText>
                      {formatCurrencyUnits({
                        amountWei: adjustedCollateralAmount
                          ? adjustedCollateralAmount.toString()
                          : pairLeverParams.data.collateralAmount?.toString(),
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
          <div className="inline-flex gap-2 font-mono lg:text-lg">
            {isClientReady && isConnected ? (
              <>
                <span>
                  {formatCurrencyUnits({
                    amountWei: availableCredit.toString(),
                    decimals: borrowAsset.data?.decimals,
                    maximumFractionDigits: 6,
                  })}
                </span>
                {(adjustedBorrowAmount || adjustedCollateralAmount) && (
                  <span className="inline-flex items-center gap-2 font-medium text-orange">
                    <FiArrowRight />
                    <GradientText>
                      {formatCurrencyUnits({
                        amountWei: adjustedAvailableCredit.toString(),
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

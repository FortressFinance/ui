import { BigNumber } from "ethers"

export const calculateLTV = ({
  borrowedAmount = BigNumber.from(0),
  collateralAmount = BigNumber.from(0),
  exchangeRate = BigNumber.from(0),
  exchangePrecision = BigNumber.from(1),
  ltvPrecision = BigNumber.from(0),
}: {
  borrowedAmount?: BigNumber
  collateralAmount?: BigNumber
  exchangeRate?: BigNumber
  exchangePrecision?: BigNumber
  ltvPrecision?: BigNumber
}) =>
  collateralAmount.lte(0)
    ? BigNumber.from(0)
    : borrowedAmount
        .mul(exchangeRate)
        .div(exchangePrecision)
        .mul(ltvPrecision)
        .div(collateralAmount)

export const ltvPercentage = (
  ltv = BigNumber.from(0),
  ltvPrecision = BigNumber.from(100)
) => ltv.div(ltvPrecision.div(100)).toNumber().toFixed(2) + "%"

export const calculateMaxLeverage = ({
  maxLTV = BigNumber.from(0),
  ltvPrecision = BigNumber.from(1),
}) =>
  BigNumber.from(1)
    .mul(ltvPrecision)
    .div(BigNumber.from(1).mul(ltvPrecision).sub(maxLTV))
    .toNumber()

export const assetToCollateral = (
  amount = BigNumber.from(0),
  exchangeRate = BigNumber.from(1),
  exchangePrecision = BigNumber.from(1)
) => amount.mul(exchangePrecision).div(exchangeRate)

export const collateralToAsset = (
  amount = BigNumber.from(0),
  exchangeRate = BigNumber.from(1),
  exchangePrecision = BigNumber.from(1)
) => amount.mul(exchangeRate).div(exchangePrecision)

export const addSlippage = (amount = BigNumber.from(0), slippage: number) =>
  amount.add(amount.div(1 / slippage))

export const calculateUtilizationRate = ({
  totalAssets = BigNumber.from(1),
  totalBorrowAmount = BigNumber.from(0),
  utilPrecision = BigNumber.from(1),
}) =>
  totalBorrowAmount.mul(utilPrecision).div(totalAssets).toNumber() /
  utilPrecision.toNumber()

export const calculateBorrowAPY = ({
  interestRatePerSecond = BigNumber.from(0),
}) => (1 + interestRatePerSecond.toNumber() / 1e18) ** (365 * 24 * 60 * 60) - 1

export const calculateLendAPY = ({ borrowAPY = 0, utilizationRate = 0 }) =>
  borrowAPY * utilizationRate

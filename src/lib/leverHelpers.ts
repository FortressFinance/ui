import { subSlippage } from "@/lib/slippageHelpers"

export const calculateLTV = ({
  borrowedAmountAsCollateral = 0n,
  collateralAmount = 0n,
  ltvPrecision = 0n,
}: {
  borrowedAmountAsCollateral?: bigint
  collateralAmount?: bigint
  ltvPrecision?: bigint
}) =>
  collateralAmount <= 0
    ? 0n
    : (borrowedAmountAsCollateral * ltvPrecision) / collateralAmount

export const ltvPercentage = (ltv = 0n, ltvPrecision = 100n) =>
  Number(ltv / (ltvPrecision / 100n)).toFixed(2) + "%"

export const calculateMaxLeverage = ({ maxLTV = 0n, ltvPrecision = 1n }) =>
  Number((1n * ltvPrecision) / (1n * ltvPrecision - maxLTV))

export const assetToCollateral = (
  amount = 0n,
  exchangeRate = 1n,
  exchangePrecision = 1n
) => (amount * exchangePrecision) / exchangeRate

export const collateralToAsset = (
  amount = 0n,
  exchangeRate = 1n,
  exchangePrecision = 1n
) => (amount * exchangeRate) / exchangePrecision

export const calculateAssetsAvailable = ({
  totalAssets = 0n,
  totalBorrowAmount = 0n,
}) => totalAssets - totalBorrowAmount

export const calculateUtilizationRate = ({
  totalAssets = 1n,
  totalBorrowAmount = 0n,
  utilPrecision = 1n,
}) =>
  Number((totalBorrowAmount * utilPrecision) / totalAssets) /
  Number(utilPrecision)

export const calculateBorrowAPY = ({ interestRatePerSecond = 0n }) =>
  (1 + Number(interestRatePerSecond) / 1e18) ** (365 * 24 * 60 * 60) - 1

export const calculateLendAPY = ({ borrowAPY = 0, utilizationRate = 0 }) =>
  borrowAPY * utilizationRate

export const calculateMaxBorrowAmount = ({
  collateralAmountAsAsset = 0n,
  maxLTV = 0n,
  ltvPrecision = 1n,
}) => (collateralAmountAsAsset * maxLTV) / ltvPrecision

export const calculateAvailableCredit = ({
  borrowedAmount = 0n,
  maxBorrowAmount = 0n,
}) => maxBorrowAmount - borrowedAmount

export const calculateLiquidationPrice = ({
  ltv = 0n,
  ltvPrecision = 0n,
  maxLTV = 0n,
  exchangeRate = 0n,
}) =>
  subSlippage(
    exchangeRate,
    Number((maxLTV - ltv) * 100n) / Number(ltvPrecision)
  )

export const calculateMinCollateralRequired = ({
  borrowedAmountAsCollateral = 1n,
  maxLTV = 1n,
  ltvPrecision = 1n,
}) =>
  (borrowedAmountAsCollateral * ltvPrecision) /
  // If the user actually removes enough collateral to hit maxLTV, they will be insolvent
  // Subtract 3% from the maxLTV to prevent this
  (maxLTV - (30n * ltvPrecision) / 1000n)

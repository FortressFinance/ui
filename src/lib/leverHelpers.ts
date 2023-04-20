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

import { BigNumber } from "ethers"

import {
  assetToCollateral,
  calculateBorrowAPY,
  calculateLendAPY,
  calculateLiquidationPrice,
  calculateLTV,
  calculateMaxBorrowAmount,
  calculateMaxLeverage,
  calculateUtilizationRate,
  collateralToAsset,
  ltvPercentage,
} from "@/lib/leverHelpers"

describe("leverHelpers", () => {
  describe("calculateLTV", () => {
    const cases = [
      {
        borrowedAmountAsCollateral: undefined,
        collateralAmount: undefined,
        ltvPrecision: undefined,
        expected: "0",
      },
      {
        borrowedAmountAsCollateral: BigNumber.from(0),
        collateralAmount: BigNumber.from(0),
        ltvPrecision: BigNumber.from(0),
        expected: "0",
      },
      {
        borrowedAmountAsCollateral: BigNumber.from(1),
        collateralAmount: BigNumber.from(1),
        ltvPrecision: BigNumber.from(1),
        expected: "1",
      },
      {
        borrowedAmountAsCollateral: BigNumber.from(1),
        collateralAmount: BigNumber.from(5),
        ltvPrecision: BigNumber.from(1000),
        expected: "200",
      },
    ]
    test.each(cases)(
      "should return %p when called with %p",
      ({
        borrowedAmountAsCollateral,
        collateralAmount,
        ltvPrecision,
        expected,
      }) => {
        expect(
          calculateLTV({
            borrowedAmountAsCollateral,
            collateralAmount,
            ltvPrecision,
          }).toString()
        ).toEqual(expected)
      }
    )
  })

  describe("ltvPercentage", () => {
    const cases = [
      {
        ltv: undefined,
        ltvPrecision: undefined,
        expected: "0.00%",
      },
      {
        ltv: BigNumber.from(0),
        ltvPrecision: BigNumber.from(100),
        expected: "0.00%",
      },
      {
        ltv: BigNumber.from(100),
        ltvPrecision: BigNumber.from(100),
        expected: "100.00%",
      },
      {
        ltv: BigNumber.from(200),
        ltvPrecision: BigNumber.from(1000),
        expected: "20.00%",
      },
    ]
    test.each(cases)(
      "should return %p when called with %p",
      ({ ltv, ltvPrecision, expected }) => {
        expect(ltvPercentage(ltv, ltvPrecision)).toEqual(expected)
      }
    )
  })

  describe("calculateMaxLeverage", () => {
    const cases = [
      {
        maxLTV: undefined,
        ltvPrecision: undefined,
        expected: 1,
      },
      {
        maxLTV: BigNumber.from(0),
        ltvPrecision: BigNumber.from(1),
        expected: 1,
      },
      {
        maxLTV: BigNumber.from(100),
        ltvPrecision: BigNumber.from(1),
        expected: 0,
      },
      {
        maxLTV: BigNumber.from(800),
        ltvPrecision: BigNumber.from(1000),
        expected: 5,
      },
    ]
    test.each(cases)(
      "should return %p when called with %p",
      ({ maxLTV, ltvPrecision, expected }) => {
        expect(
          calculateMaxLeverage({
            maxLTV,
            ltvPrecision,
          })
        ).toEqual(expected)
      }
    )
  })

  describe("assetToCollateral", () => {
    const cases = [
      {
        amount: undefined,
        exchangeRate: undefined,
        exchangePrecision: undefined,
        expected: "0",
      },
      {
        amount: BigNumber.from(0),
        exchangeRate: BigNumber.from(1),
        exchangePrecision: BigNumber.from(0),
        expected: "0",
      },
      {
        amount: BigNumber.from(1),
        exchangeRate: BigNumber.from(1),
        exchangePrecision: BigNumber.from(1),
        expected: "1",
      },
      {
        amount: BigNumber.from(1),
        exchangeRate: BigNumber.from(5),
        exchangePrecision: BigNumber.from(1000),
        expected: "200",
      },
    ]
    test.each(cases)(
      "should return %p when called with %p",
      ({ amount, exchangeRate, exchangePrecision, expected }) => {
        expect(
          assetToCollateral(amount, exchangeRate, exchangePrecision).toString()
        ).toEqual(expected)
      }
    )
  })

  describe("collateralToAsset", () => {
    const cases = [
      {
        amount: undefined,
        exchangeRate: undefined,
        exchangePrecision: undefined,
        expected: "0",
      },
      {
        amount: BigNumber.from(0),
        exchangeRate: BigNumber.from(0),
        exchangePrecision: BigNumber.from(1),
        expected: "0",
      },
      {
        amount: BigNumber.from(1),
        exchangeRate: BigNumber.from(1),
        exchangePrecision: BigNumber.from(1),
        expected: "1",
      },
      {
        amount: BigNumber.from(5),
        exchangeRate: BigNumber.from(1000),
        exchangePrecision: BigNumber.from(1000),
        expected: "5",
      },
    ]
    test.each(cases)(
      "should return %p when called with %p",
      ({ amount, exchangeRate, exchangePrecision, expected }) => {
        expect(
          collateralToAsset(amount, exchangeRate, exchangePrecision).toString()
        ).toEqual(expected)
      }
    )
  })

  describe("calculateUtilizationRate", () => {
    const cases = [
      {
        totalAssets: undefined,
        totalBorrowAmount: undefined,
        utilPrecision: undefined,
        expected: "0",
      },
      {
        totalAssets: BigNumber.from(1),
        totalBorrowAmount: BigNumber.from(0),
        utilPrecision: BigNumber.from(1),
        expected: "0",
      },
      {
        totalAssets: BigNumber.from(1),
        totalBorrowAmount: BigNumber.from(1),
        utilPrecision: BigNumber.from(1),
        expected: "1",
      },
      {
        totalAssets: BigNumber.from(100),
        totalBorrowAmount: BigNumber.from(50),
        utilPrecision: BigNumber.from(1000),
        expected: "0.5",
      },
    ]
    test.each(cases)(
      "should return %p when called with %p",
      ({ totalAssets, totalBorrowAmount, utilPrecision, expected }) => {
        expect(
          calculateUtilizationRate({
            totalAssets,
            totalBorrowAmount,
            utilPrecision,
          }).toString()
        ).toEqual(expected)
      }
    )
  })

  describe("calculateBorrowAPY", () => {
    const cases = [
      {
        interestRatePerSecond: undefined,
        expected: "0",
      },
      {
        interestRatePerSecond: BigNumber.from(0),
        expected: "0",
      },
      {
        interestRatePerSecond: BigNumber.from("158049988"),
        expected: "0.004996707465613426",
      },
    ]

    test.each(cases)(
      "should return %p when called with %p",
      ({ interestRatePerSecond, expected }) => {
        expect(
          calculateBorrowAPY({ interestRatePerSecond }).toString()
        ).toEqual(expected)
      }
    )
  })

  describe("calculateLendAPY", () => {
    const cases = [
      {
        borrowAPY: undefined,
        utilizationRate: undefined,
        expected: "0",
      },
      {
        borrowAPY: 0,
        utilizationRate: 0,
        expected: "0",
      },
      {
        borrowAPY: 0.004996707465613426,
        utilizationRate: 0.1,
        expected: "0.0004996707465613426",
      },
      {
        borrowAPY: 0.004996707465613426,
        utilizationRate: 0.5,
        expected: "0.002498353732806713",
      },
      {
        borrowAPY: 0.004996707465613426,
        utilizationRate: 1,
        expected: "0.004996707465613426",
      },
    ]
    test.each(cases)(
      "should return %p when called with %p",
      ({ borrowAPY, utilizationRate, expected }) => {
        expect(
          calculateLendAPY({ borrowAPY, utilizationRate }).toString()
        ).toEqual(expected)
      }
    )
  })

  describe("calculateMaxBorrowAmount", () => {
    const cases = [
      {
        collateralAmountAsAsset: undefined,
        maxLTV: undefined,
        ltvPrecision: undefined,
        expected: "0",
      },
      {
        collateralAmountAsAsset: BigNumber.from(0),
        maxLTV: BigNumber.from(0),
        ltvPrecision: BigNumber.from(1),
        expected: "0",
      },
      {
        collateralAmountAsAsset: BigNumber.from(1),
        maxLTV: BigNumber.from(1),
        ltvPrecision: BigNumber.from(1),
        expected: "1",
      },
    ]
    test.each(cases)(
      "should return %p when called with %p",
      ({ collateralAmountAsAsset, maxLTV, ltvPrecision, expected }) => {
        expect(
          calculateMaxBorrowAmount({
            collateralAmountAsAsset,
            maxLTV,
            ltvPrecision,
          }).toString()
        ).toEqual(expected)
      }
    )
  })

  describe("calculateLiquidationPrice", () => {
    const cases = [
      {
        borrowedAmount: undefined,
        maxBorrowAmount: undefined,
        exchangePrecision: undefined,
        expected: "1",
      },
      {
        borrowedAmount: BigNumber.from(1),
        maxBorrowAmount: BigNumber.from(1),
        exchangePrecision: BigNumber.from(1),
        expected: "1",
      },
      {
        borrowedAmount: BigNumber.from(100),
        maxBorrowAmount: BigNumber.from(500),
        exchangePrecision: BigNumber.from(100),
        expected: "20",
      },
      {
        borrowedAmount: BigNumber.from("4749510656262000534"),
        maxBorrowAmount: BigNumber.from("17874808905703125237"),
        exchangePrecision: BigNumber.from("1000000000000000000"),
        expected: "265709730454607806",
      },
    ]
    test.each(cases)(
      "should return %p when called with %p",
      ({ borrowedAmount, maxBorrowAmount, exchangePrecision, expected }) => {
        expect(
          calculateLiquidationPrice({
            borrowedAmount,
            maxBorrowAmount,
            exchangePrecision,
          }).toString()
        ).toEqual(expected)
      }
    )
  })
})

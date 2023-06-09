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
        borrowedAmountAsCollateral: 0n,
        collateralAmount: 0n,
        ltvPrecision: 0n,
        expected: "0",
      },
      {
        borrowedAmountAsCollateral: 1n,
        collateralAmount: 1n,
        ltvPrecision: 1n,
        expected: "1",
      },
      {
        borrowedAmountAsCollateral: 1n,
        collateralAmount: 5n,
        ltvPrecision: 1000n,
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
        ltv: 0n,
        ltvPrecision: 100n,
        expected: "0.00%",
      },
      {
        ltv: 100n,
        ltvPrecision: 100n,
        expected: "100.00%",
      },
      {
        ltv: 200n,
        ltvPrecision: 1000n,
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
        maxLTV: 0n,
        ltvPrecision: 1n,
        expected: 1,
      },
      {
        maxLTV: 100n,
        ltvPrecision: 1n,
        expected: 0,
      },
      {
        maxLTV: 800n,
        ltvPrecision: 1000n,
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
        amount: 0n,
        exchangeRate: 1n,
        exchangePrecision: 0n,
        expected: "0",
      },
      {
        amount: 1n,
        exchangeRate: 1n,
        exchangePrecision: 1n,
        expected: "1",
      },
      {
        amount: 1n,
        exchangeRate: 5n,
        exchangePrecision: 1000n,
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
        amount: 0n,
        exchangeRate: 0n,
        exchangePrecision: 1n,
        expected: "0",
      },
      {
        amount: 1n,
        exchangeRate: 1n,
        exchangePrecision: 1n,
        expected: "1",
      },
      {
        amount: 5n,
        exchangeRate: 1000n,
        exchangePrecision: 1000n,
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
        totalAssets: 1n,
        totalBorrowAmount: 0n,
        utilPrecision: 1n,
        expected: "0",
      },
      {
        totalAssets: 1n,
        totalBorrowAmount: 1n,
        utilPrecision: 1n,
        expected: "1",
      },
      {
        totalAssets: 100n,
        totalBorrowAmount: 50n,
        utilPrecision: 1000n,
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
        interestRatePerSecond: 0n,
        expected: "0",
      },
      {
        interestRatePerSecond: 158049988n,
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
        collateralAmountAsAsset: 0n,
        maxLTV: 0n,
        ltvPrecision: 1n,
        expected: "0",
      },
      {
        collateralAmountAsAsset: 1n,
        maxLTV: 1n,
        ltvPrecision: 1n,
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
        ltv: undefined,
        ltvPrecision: undefined,
        maxLTV: undefined,
        exchangeRate: undefined,
        expected: "0",
      },
      {
        ltv: 0n,
        ltvPrecision: 0n,
        maxLTV: 0n,
        exchangeRate: 0n,
        expected: "0",
      },
      {
        ltv: 49706n,
        ltvPrecision: 100000n,
        maxLTV: 81000n,
        exchangeRate: 1004456814569838980n,
        expected: "690122099018353570",
      },
    ]
    test.each(cases)(
      "should return %p when called with %p",
      ({ ltv, ltvPrecision, maxLTV, exchangeRate, expected }) => {
        expect(
          calculateLiquidationPrice({
            ltv,
            ltvPrecision,
            maxLTV,
            exchangeRate,
          }).toString()
        ).toEqual(expected)
      }
    )
  })
})

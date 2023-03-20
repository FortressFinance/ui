import { formatCurrencyUnits, formatUsd } from "@/lib/helpers/formatCurrency"

describe("formatCurrencyUnits", () => {
  test.each([
    {
      abbreviate: undefined,
      amountWei: "1000000000000000000000",
      expected: "1000.0",
    },
    {
      abbreviate: undefined,
      amountWei: "6000000000",
      decimals: 6,
      expected: "6000.0",
    },
    {
      abbreviate: false,
      amountWei: "1000000000000000000000",
      expected: "1000.0",
    },
    {
      abbreviate: false,
      amountWei: "6000000000",
      decimals: 6,
      expected: "6000.0",
    },
    { abbreviate: true, amountWei: "1000000000000000000000", expected: "1K" },
    { abbreviate: true, amountWei: "6000000000", decimals: 6, expected: "6K" },
  ])(
    "it returns $expected when passed abbreviate: $abbreviate, amountWei: $amountWei, decimals: $decimals",
    ({ abbreviate, amountWei, decimals, expected }) =>
      expect(formatCurrencyUnits({ abbreviate, amountWei, decimals })).toBe(
        expected
      )
  )
})

describe("formatUsd", () => {
  test.each([
    { abbreviate: undefined, amountWei: undefined, expected: "$0.00" },
    { abbreviate: undefined, amount: 0, expected: "$0.00" },
    { abbreviate: false, amount: 0, expected: "$0.00" },
    { abbreviate: false, amount: 1003232.2323, expected: "$1,003,232.23" },
    { abbreviate: true, amount: 1003232.2323, expected: "$1M" },
  ])(
    "it returns $expected when passed abbreviate: $abbreviate, amount: $amount",
    ({ abbreviate, amount, expected }) =>
      expect(formatUsd({ abbreviate, amount })).toBe(expected)
  )
})

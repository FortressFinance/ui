import { formatCurrencyUnits, formatUsd } from "@/lib/helpers/formatCurrency"

describe("formatCurrencyUnits", () => {
  test.each([
    {
      amountWei: "1000000000000000000000",
      decimals: undefined,
      maximumFractionDigits: undefined,
      expected: "1000",
    },
    {
      amountWei: "1000006234522414525125",
      decimals: undefined,
      maximumFractionDigits: undefined,
      expected: "1000.006234522414525125",
    },
    {
      amountWei: "1249628392838232234",
      decimals: undefined,
      maximumFractionDigits: 6,
      expected: "1.249628",
    },
    {
      amountWei: "6000000000",
      decimals: 6,
      maximumFractionDigits: undefined,
      expected: "6000",
    },
    {
      amountWei: "1000000000000000000000",
      decimals: undefined,
      maximumFractionDigits: undefined,
      expected: "1000",
    },
    {
      amountWei: "6000000000",
      decimals: 6,
      maximumFractionDigits: undefined,
      expected: "6000",
    },
    {
      amountWei: "1000000000000000000000",
      decimals: undefined,
      maximumFractionDigits: 2,
      expected: "1K",
    },
    {
      amountWei: "6000000000",
      decimals: 6,
      maximumFractionDigits: 2,
      expected: "6K",
    },
  ])(
    "it returns $expected when passed amountWei: $amountWei, decimals: $decimals, maximumFractionDigits: $maximumFractionDigits",
    ({ amountWei, decimals, maximumFractionDigits, expected }) =>
      expect(
        formatCurrencyUnits({ amountWei, decimals, maximumFractionDigits })
      ).toBe(expected)
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

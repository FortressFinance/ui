import { parseUnits } from "ethers/lib/utils.js"

import { parseCurrencyUnits } from "@/lib/helpers/parseCurrency"

describe("parseCurrencyUnits", () => {
  test.each([
    {
      amountFormatted: undefined,
      decimals: undefined,
      expected: parseUnits("0", 18),
    },
    {
      amountFormatted: undefined,
      decimals: undefined,
      expected: parseUnits("0", 18),
    },
    {
      amountFormatted: "0",
      decimals: undefined,
      expected: parseUnits("0", 18),
    },
    {
      amountFormatted: "0",
      decimals: 18,
      expected: parseUnits("0", 18),
    },
    {
      amountFormatted: "1",
      decimals: 18,
      expected: parseUnits("1", 18),
    },
    {
      amountFormatted: "1.0",
      decimals: 18,
      expected: parseUnits("1", 18),
    },
    {
      amountFormatted: "10.123456789012345678",
      decimals: 18,
      expected: parseUnits("10.123456789012345678", 18),
    },
    {
      amountFormatted: "10.1234567890123456789999",
      decimals: undefined,
      expected: parseUnits("10.123456789012345678", 18),
    },
    {
      amountFormatted: "10.1234567890123456789999",
      decimals: 6,
      expected: parseUnits("10.123456", 6),
    },
  ])(
    "it returns $expected when passed amountFormatted: $amountFormatted, decimals: $decimals",
    ({ amountFormatted, decimals, expected }) =>
      expect(parseCurrencyUnits({ amountFormatted, decimals })).toEqual(
        expected
      )
  )
})

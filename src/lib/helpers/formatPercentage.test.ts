import { formatPercentage } from "@/lib/helpers/formatPercentage"

describe("formatPercentage", () => {
  test.each([
    { value: undefined, expected: "0.00%" },
    { value: 0, expected: "0.00%" },
    { value: 1, expected: "100.00%" },
    { value: 0.1, expected: "10.00%" },
    { value: 0.01, expected: "1.00%" },
    { value: 0.001, expected: "0.10%" },
    { value: 0.0001, expected: "0.01%" },
    { value: 0.00001, expected: "0.00%" },
    { value: "0", expected: "0.00%" },
    { value: "1", expected: "100.00%" },
    { value: "0.1", expected: "10.00%" },
    { value: "0.01", expected: "1.00%" },
    { value: "0.001", expected: "0.10%" },
    { value: "0.0001", expected: "0.01%" },
    { value: "0.00001", expected: "0.00%" },
  ])("it returns $expected when passed $value", ({ value, expected }) =>
    expect(formatPercentage(value)).toBe(expected)
  )
})

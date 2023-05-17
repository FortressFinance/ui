import { convertToApr, convertToApy } from "@/lib/api/vaults/convertToApy"

describe("convertToApy", () => {
  it("should return 0 when apr is undefined", () => {
    const apr = undefined
    const result = convertToApy(apr)
    expect(result).toBe(0)
  })

  it("should calculate APY correctly when apr is provided", () => {
    const apr = 0.1 // Example APR value
    const expectedApy = 0.1050673538158986 // Expected APY value with 10 decimal places
    const result = convertToApy(apr)
    expect(result).toBeCloseTo(expectedApy, 10)
  })
})

describe("calculateApr", () => {
  it("should return 0 when apy is undefined", () => {
    const apy = undefined
    const result = convertToApr(apy)
    expect(result).toBe(0)
  })

  it("should calculate APR correctly when apy is provided", () => {
    const apy = 0.1 // Example APY value
    const expectedApr = 0.09539546649410101 // Expected APR value with 10 decimal places
    const result = convertToApr(apy)
    expect(result).toBeCloseTo(expectedApr, 10)
  })
})

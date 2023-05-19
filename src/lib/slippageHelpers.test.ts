import {
  addSlippage,
  percentageOfBigInt,
  subSlippage,
} from "@/lib/slippageHelpers"

describe("percentageOfBigInt", () => {
  it("returns 0n when any combination of args are undefined", () => {
    expect(percentageOfBigInt()).toEqual(0n)
    expect(percentageOfBigInt(100n)).toEqual(0n)
    expect(percentageOfBigInt(undefined, 5)).toEqual(0n)
  })

  it("returns a new bigint that is the percentage of the amount", () => {
    expect(percentageOfBigInt(100n, 5)).toEqual(5n)
    expect(percentageOfBigInt(100n, 95)).toEqual(95n)
  })
})

describe("addSlippage", () => {
  it("returns 0n when all args are undefined", () => {
    expect(addSlippage()).toEqual(0n)
  })

  it("returns a new bigint equal in value to the passed amount when slippage is undefined", () => {
    expect(addSlippage(100n)).toEqual(100n)
  })

  it("returns a new bigint with a slippage percentage added", () => {
    expect(addSlippage(100n, 5)).toEqual(105n)
    expect(addSlippage(100n, 95)).toEqual(195n)
  })
})

describe("subSlippage", () => {
  it("returns 0n when all args are undefined", () => {
    expect(subSlippage()).toEqual(0n)
  })

  it("returns a new bigint equal in value to the passed amount when slippage is undefined", () => {
    expect(subSlippage(100n)).toEqual(100n)
  })

  it("returns a new bigint with a slippage percentage subtracted", () => {
    expect(subSlippage(100n, 5)).toEqual(95n)
    expect(subSlippage(100n, 95)).toEqual(5n)
  })
})

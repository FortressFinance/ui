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

  it("returns 0n when amount is less than 10000n", () => {
    expect(percentageOfBigInt(9999n, 1)).toEqual(0n)
  })

  it("returns a new bigint that is the percentage of the amount", () => {
    expect(percentageOfBigInt(100000n, 1)).toEqual(1n)
    expect(percentageOfBigInt(100000n, 10)).toEqual(10n)
    expect(percentageOfBigInt(100000n, 100)).toEqual(100n)
    expect(percentageOfBigInt(100000n, 1000)).toEqual(1000n)
    expect(percentageOfBigInt(100000n, 10000)).toEqual(10000n)
    expect(percentageOfBigInt(100000n, 100000)).toEqual(100000n)
  })
})

describe("addSlippage", () => {
  it("returns 0n when all args are undefined", () => {
    expect(addSlippage()).toEqual(0n)
  })

  it("returns a new bigint equal in value to the passed amount when slippage is undefined", () => {
    expect(addSlippage(100000n)).toEqual(100000n)
  })

  it("returns a new bigint with a slippage percentage added", () => {
    expect(addSlippage(100000n, 0.01)).toEqual(100010n)
    expect(addSlippage(100000n, 0.1)).toEqual(100100n)
    expect(addSlippage(100000n, 1)).toEqual(101000n)
    expect(addSlippage(100000n, 10)).toEqual(110000n)
    expect(addSlippage(100000n, 100)).toEqual(200000n)
  })
})

describe("subSlippage", () => {
  it("returns 0n when all args are undefined", () => {
    expect(subSlippage()).toEqual(0n)
  })

  it("returns a new bigint equal in value to the passed amount when slippage is undefined", () => {
    expect(subSlippage(100000n)).toEqual(100000n)
  })

  it("returns a new bigint with a slippage percentage subtracted", () => {
    expect(subSlippage(100000n, 0.001)).toEqual(99999n)
    expect(subSlippage(100000n, 0.01)).toEqual(99990n)
    expect(subSlippage(100000n, 0.1)).toEqual(99900n)
    expect(subSlippage(100000n, 1)).toEqual(99000n)
    expect(subSlippage(100000n, 10)).toEqual(90000n)
    expect(subSlippage(100000n, 100)).toEqual(0n)
  })
})

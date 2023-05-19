import { isAddress, shortenAddress } from "@/lib/helpers"

jest.mock("ethers/lib/utils.js")

describe("isAddress", () => {
  it("returns false if not", () => {
    expect(isAddress("")).toBe(false)
    expect(isAddress("0x0000")).toBe(false)
    expect(isAddress(1)).toBe(false)
    expect(isAddress({})).toBe(false)
    expect(isAddress(undefined)).toBe(false)
  })

  it("returns the checksummed address", () => {
    expect(isAddress("0xf164fc0ec4e93095b804a4795bbe1e041497b92a")).toBe(
      "0xf164fC0Ec4E93095b804a4795bBe1e041497b92a"
    )
    expect(isAddress("0xf164fC0Ec4E93095b804a4795bBe1e041497b92a")).toBe(
      "0xf164fC0Ec4E93095b804a4795bBe1e041497b92a"
    )
  })

  it("succeeds even without prefix", () => {
    expect(isAddress("f164fc0ec4e93095b804a4795bbe1e041497b92a")).toBe(
      "0xf164fC0Ec4E93095b804a4795bBe1e041497b92a"
    )
  })
  it("fails if too long", () => {
    expect(isAddress("f164fc0ec4e93095b804a4795bbe1e041497b92a0")).toBe(false)
  })
})

describe("shortenAddress", () => {
  it("should shorten the checksummed version of the input address with default characters", () => {
    const inputAddress = "0x1234567890123456789012345678901234567890"
    const expectedShortenedAddress = "0x1234...7890"

    const result = shortenAddress(inputAddress)

    expect(result).toBe(expectedShortenedAddress)
  })

  it("should shorten the checksummed version of the input address with custom characters", () => {
    const inputAddress = "0x1234567890123456789012345678901234567890"
    const expectedShortenedAddress = "0x12...90"

    const result = shortenAddress(inputAddress, 2)

    expect(result).toBe(expectedShortenedAddress)
  })

  it("should throw an error if the address is invalid", () => {
    const invalidAddress = "invalid-address"

    expect(() => shortenAddress(invalidAddress)).toThrowError(
      `Invalid 'address' parameter '${invalidAddress}'.`
    )
  })

  it("throws on invalid address", () => {
    expect(() => shortenAddress("abc")).toThrow("Invalid 'address'")
  })

  it("truncates middle characters", () => {
    expect(shortenAddress("0xf164fc0ec4e93095b804a4795bbe1e041497b92a")).toBe(
      "0xf164...b92a"
    )
  })

  it("truncates middle characters even without prefix", () => {
    expect(shortenAddress("f164fc0ec4e93095b804a4795bbe1e041497b92a")).toBe(
      "0xf164...b92a"
    )
  })

  it("renders checksummed address", () => {
    expect(
      shortenAddress("0x2E1b342132A67Ea578e4E3B814bae2107dc254CC".toLowerCase())
    ).toBe("0x2E1b...54CC")
  })
})

import { renderWagmiHook } from "test/renderWagmiHook"

import { useTokenOrNative } from "@/hooks/useTokenOrNative"

import { ethTokenAddress, glpTokenAddress } from "@/constant/addresses"

describe("useTokenOrNative", () => {
  it(`returns ETH information when passed address:${ethTokenAddress}`, async () => {
    const { result, waitFor } = renderWagmiHook(() =>
      useTokenOrNative({ address: ethTokenAddress })
    )
    await waitFor(() => expect(result.current.isSuccess).toBeTruthy())

    expect(result.current.data).toEqual({
      address: undefined,
      decimals: 18,
      name: "Ether",
      symbol: "ETH",
      totalSupply: undefined,
    })
  })

  it("returns token information when passed a token address", async () => {
    const { result, waitFor } = renderWagmiHook(() =>
      useTokenOrNative({ address: glpTokenAddress })
    )

    await waitFor(() => expect(result.current.isSuccess).toBeTruthy())

    expect(result.current.data).toEqual(
      expect.objectContaining({
        address: glpTokenAddress,
        decimals: 18,
        name: "StakedGlp",
        symbol: "sGLP",
      })
    )
  })
})

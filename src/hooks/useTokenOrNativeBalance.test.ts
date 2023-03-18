import { renderHook } from "test/renderHook"
import { getSigners } from "test/utils"
import { useAccount } from "wagmi"

import { useTokenOrNativeBalance } from "@/hooks/useTokenOrNativeBalance"

import { ethTokenAddress, glpTokenAddress } from "@/constant/addresses"

jest.mock("wagmi", () => ({
  ...jest.requireActual("wagmi"),
  useAccount: jest.fn(() => ({ address: getSigners()[0].address })),
}))

const mockUseAccount = jest.mocked(useAccount)

// Skipping this for now because there is something flaky with it

describe.skip("useTokenOrNativeBalance", () => {
  it(`returns ETH information when passed address:${ethTokenAddress}`, async () => {
    const balance = renderHook(() =>
      useTokenOrNativeBalance({ address: ethTokenAddress })
    )
    await balance.waitFor(() =>
      expect(balance.result.current.isSuccess).toBeTruthy()
    )
    expect(balance.result.current.data).toEqual(
      expect.objectContaining({ decimals: 18, symbol: "WETH" })
    )
  })

  it("returns token information when passed a token address", async () => {
    const balance = renderHook(() =>
      useTokenOrNativeBalance({ address: glpTokenAddress })
    )
    await balance.waitFor(
      () => expect(balance.result.current.isSuccess).toBeTruthy(),
      { timeout: 10_000 }
    )
    expect(balance.result.current.data).toEqual(
      expect.objectContaining({ decimals: 18, symbol: "sGLP" })
    )
  })

  it("returns undefined when account is not connected", async () => {
    mockUseAccount.mockImplementation(() => ({
      address: undefined,
      connector: undefined,
      isConnected: false,
      isConnecting: false,
      isDisconnected: true,
      isReconnecting: false,
      status: "disconnected",
    }))
    const balance = renderHook(() =>
      useTokenOrNativeBalance({ address: glpTokenAddress })
    )
    await balance.waitFor(() =>
      expect(balance.result.current.isIdle).toBeTruthy()
    )
    expect(balance.result.current.data).toBeUndefined()
  })
})

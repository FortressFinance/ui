import { act } from "@testing-library/react"
import { renderHook } from "test/renderHook"
import { mainnet, useNetwork } from "wagmi"

import { arbitrumFork, mainnetFork } from "@/lib/wagmi"
import { useActiveChainId } from "@/hooks/useActiveChainId"

import { useGlobalStore } from "@/store"

jest.mock("wagmi", () => ({
  ...jest.requireActual("wagmi"),
  useNetwork: jest.fn(() => ({ chain: undefined })),
}))

const mockUseNetwork = jest.mocked(useNetwork)

describe("useActiveChainId", () => {
  it("returns the expected chainId when the user is not connected", async () => {
    const setChainId = renderHook(() =>
      useGlobalStore((store) => store.setActiveChainId)
    )
    const { result } = renderHook(() => useActiveChainId())
    expect(result.current).toEqual(mainnetFork.id)

    act(() => setChainId.result.current(arbitrumFork.id))
    expect(result.current).toEqual(arbitrumFork.id)
  })

  it("returns the expected chainId when the user is connected", async () => {
    mockUseNetwork.mockImplementation(() => ({
      chain: mainnet,
      chains: [arbitrumFork],
    }))

    const activeChainId = renderHook(() => useActiveChainId())
    expect(activeChainId.result.current).toEqual(mainnet.id)
  })
})

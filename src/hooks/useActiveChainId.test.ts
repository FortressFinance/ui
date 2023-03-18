import { act } from "@testing-library/react"
import { renderHook } from "test/renderHook"

import { useActiveChainId } from "@/hooks/useActiveChainId"

import { arbitrumFork, chains } from "@/components/AppProviders"

import { useActiveChain } from "@/store/activeChain"

describe("useActiveChainId", () => {
  it("returns the expected chainId when the user is not connected", async () => {
    const setChainId = renderHook(() =>
      useActiveChain((store) => store.setChainId)
    )
    const { result } = renderHook(() => useActiveChainId())
    expect(result.current).toEqual(chains[0].id)

    act(() => setChainId.result.current(arbitrumFork.id))
    expect(result.current).toEqual(arbitrumFork.id)
  })
})

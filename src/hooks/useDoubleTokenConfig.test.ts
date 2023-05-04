import { renderHook } from "test/renderHook"

import { useDoubleTokenConfig } from "./useDoubleTokenConfig"

jest.mock("@/hooks/useActiveChainConfig", () => ({
  useActiveChainConfig: jest.fn(() => ({
    fctrTriCryptoFcGlpTokenAddress: "0x123",
    fcTriCryptoTokenAddress: "0x456",
    fcGlpTokenAddress: "0x789",
    fctrFraxBPFcGlpTokenAddress: "0xabc",
  })),
}))

describe("useDoubleTokenConfig", () => {
  it("returns the correct double tokens", () => {
    const { result } = renderHook(() => useDoubleTokenConfig())
    expect(result.current).toEqual({
      "0x123": ["0x456", "0x789"],
      "0xabc": ["0xC9B8a3FDECB9D5b218d02555a8Baf332E5B740d5", "0x789"],
    })
  })
})

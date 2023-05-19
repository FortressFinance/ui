import { renderHook } from "test/renderHook"

import { useDoubleTokenConfig } from "./useDoubleTokenConfig"

jest.mock("@/hooks/useActiveChainConfig", () => ({
  useActiveChainConfig: jest.fn(() => ({
    fctrTriCryptoFcGlpTokenAddress: "0x123",
    fcTriCryptoTokenAddress: "0x456",
    fcGlpTokenAddress: "0x789",
    fctrFraxBPFcGlpTokenAddress: "0xabc",
    fctrFraxBPTokenAddress: "0xdef",
    fFraxFcGlpTokenAddress: "0xaea",
    fraxTokenAddress: "0xbab",
    fallbackType: {},
  })),
}))

describe("useDoubleTokenConfig", () => {
  it("returns the correct double tokens", () => {
    const { result } = renderHook(() => useDoubleTokenConfig())
    expect(result.current).toEqual({
      "0x123": ["0x456", "0x789"],
      "0xabc": ["0xdef", "0x789"],
      "0xaea": ["0xbab", "0x789"],
    })
  })
})

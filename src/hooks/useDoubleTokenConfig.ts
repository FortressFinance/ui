import { Address } from "wagmi"

import { useActiveChainConfig } from "@/hooks/useActiveChainConfig"

export const useDoubleTokenConfig = () => {
  const chainConfig = useActiveChainConfig()
  const doubleTokens: { [key: Address]: [Address, Address] } = {
    [chainConfig.fctrTriCryptoFcGlpTokenAddress]: [
      chainConfig.fcTriCryptoTokenAddress,
      chainConfig.fcGlpTokenAddress,
    ],
    [chainConfig.fctrFraxBPFcGlpTokenAddress]: [
      chainConfig.fctrFraxBPTokenAddress,
      chainConfig.fcGlpTokenAddress,
    ],
    [chainConfig.fFraxFcGlpTokenAddress]: [
      chainConfig.fraxTokenAddress,
      chainConfig.fcGlpTokenAddress,
    ],
    [chainConfig.fFraxFcTriCryptoTokenAddress]: [
      chainConfig.fraxTokenAddress,
      chainConfig.fcTriCryptoTokenAddress,
    ],
  }

  return doubleTokens
}

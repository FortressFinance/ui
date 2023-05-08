import { Address } from "wagmi"

import { useActiveChainConfig } from "@/hooks/useActiveChainConfig"

import { fraxBpTokenAddress } from "@/constant/addresses"

export const useDoubleTokenConfig = () => {
  const chainConfig = useActiveChainConfig()
  const doubleTokens: { [key: Address]: [Address, Address] } = {
    [chainConfig.fctrTriCryptoFcGlpTokenAddress]: [
      chainConfig.fcTriCryptoTokenAddress,
      chainConfig.fcGlpTokenAddress,
    ],
    [chainConfig.fctrFraxBPFcGlpTokenAddress]: [
      fraxBpTokenAddress,
      chainConfig.fcGlpTokenAddress,
    ],
  }

  return doubleTokens
}

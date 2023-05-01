import { Address } from "wagmi"

import {
  fcGlpTokenAddress,
  fctrFraxBPFcGlpTokenAddress,
  fcTriCryptoTokenAddress,
  fctrTriCryptoFcGlpTokenAddress,
  fraxBpTokenAddress,
} from "@/constant/addresses"

export const doubleTokens: { [key: Address]: [Address, Address] } = {
  [fctrTriCryptoFcGlpTokenAddress]: [
    fcTriCryptoTokenAddress,
    fcGlpTokenAddress,
  ],
  [fctrFraxBPFcGlpTokenAddress]: [fraxBpTokenAddress, fcGlpTokenAddress],
}

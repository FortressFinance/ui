import { Address } from "wagmi"

import {
  fcGlpTokenAddress,
  fcTriCryptoTokenAddress,
  fctrTriCryptoFcGlpTokenAddress,
} from "@/constant/addresses"

export const doubleTokens: { [key: Address]: [Address, Address] } = {
  [fctrTriCryptoFcGlpTokenAddress]: [
    fcTriCryptoTokenAddress,
    fcGlpTokenAddress,
  ],
}

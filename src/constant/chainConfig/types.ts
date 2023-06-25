import { Address } from "wagmi"

import { VaultType } from "@/lib/types"

export type ChainConfig = {
  registryAddress: Address
  fctrTriCryptoFcGlpTokenAddress: Address
  fcTriCryptoTokenAddress: Address
  fcGlpTokenAddress: Address
  fctrFraxBPFcGlpTokenAddress: Address
  fctrFraxBPTokenAddress: Address
  fFraxFcGlpTokenAddress: Address
  fFraxFcTriCryptoTokenAddress: Address
  fraxTokenAddress: Address
  fallbackType: Record<Address, VaultType>
}

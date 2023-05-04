import { Address } from "wagmi"

export type ChainConfig = {
  registryAddress: Address
  lendingPairs: Array<Address>
  fctrTriCryptoFcGlpTokenAddress: Address
  fcTriCryptoTokenAddress: Address
  fcGlpTokenAddress: Address
  fctrFraxBPFcGlpTokenAddress: Address
}

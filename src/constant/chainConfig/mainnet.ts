import { zeroAddress } from "viem"

import { ChainConfig } from "@/constant/chainConfig/types"

export const mainnetConfig: ChainConfig = {
  registryAddress: zeroAddress,
  fctrTriCryptoFcGlpTokenAddress: zeroAddress,
  fcTriCryptoTokenAddress: zeroAddress,
  fcGlpTokenAddress: zeroAddress,
  fctrFraxBPFcGlpTokenAddress: zeroAddress,
  fctrFraxBPTokenAddress: zeroAddress,
  fFraxFcGlpTokenAddress: zeroAddress,
  fFraxFcTriCryptoTokenAddress: zeroAddress,
  fraxTokenAddress: "0x853d955aCEf822Db058eb8505911ED77F175b99e",
  fallbackType: {},
}

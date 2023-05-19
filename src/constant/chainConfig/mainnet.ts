import { ethers } from "ethers"

import { ChainConfig } from "@/constant/chainConfig/types"

export const mainnetConfig: ChainConfig = {
  registryAddress: ethers.constants.AddressZero,
  fctrTriCryptoFcGlpTokenAddress: ethers.constants.AddressZero,
  fcTriCryptoTokenAddress: ethers.constants.AddressZero,
  fcGlpTokenAddress: ethers.constants.AddressZero,
  fctrFraxBPFcGlpTokenAddress: ethers.constants.AddressZero,
  fctrFraxBPTokenAddress: ethers.constants.AddressZero,
  fFraxFcGlpTokenAddress: ethers.constants.AddressZero,
  fraxTokenAddress: "0x853d955aCEf822Db058eb8505911ED77F175b99e",
  fallbackType: {},
}

import { ethers } from "ethers"

import { ChainConfig } from "@/constant/chainConfig/types"

export const mainnetConfig: ChainConfig = {
  registryAddress: ethers.constants.AddressZero,
  lendingPairs: [],
  fctrTriCryptoFcGlpTokenAddress: ethers.constants.AddressZero,
  fcTriCryptoTokenAddress: ethers.constants.AddressZero,
  fcGlpTokenAddress: ethers.constants.AddressZero,
  fctrFraxBPFcGlpTokenAddress: ethers.constants.AddressZero,
}

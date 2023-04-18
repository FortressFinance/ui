import { ethers } from "ethers"

import { ChainConfig } from "@/constant/chainConfig/types"

export const mainnetConfig: ChainConfig = {
  registryAddress: ethers.constants.AddressZero,
  lendingPairs: [],
}

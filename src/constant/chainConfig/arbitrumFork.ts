import { arbitrumConfig } from "@/constant/chainConfig/arbitrum"
import { ChainConfig } from "@/constant/chainConfig/types"

export const arbitrumForkConfig: ChainConfig = {
  ...arbitrumConfig,
  registryAddress: "0x31A65C6d4EB07ad51E7afc890aC3b7bE84dF2Ead",
  lendingPairs: [],
}

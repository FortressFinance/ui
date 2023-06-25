import { Address } from "wagmi"
import { arbitrum } from "wagmi/chains"

import { arbitrumConfig } from "@/constant/chainConfig"

export type LendingPair = {
  pairAddress: Address
  chainId: number
  name: string
  underlyingAssetAddress: Address
}

type LendingPairsConfig = Array<LendingPair>

export const lendingPairs: LendingPairsConfig = [
  {
    chainId: arbitrum.id,
    pairAddress: "0x21dA5B5718ebce131071eD43D13483DD3C585F04",
    name: "fcGLP/FRAX",
    underlyingAssetAddress: arbitrumConfig.wethTokenAddress,
  },
  {
    chainId: arbitrum.id,
    pairAddress: "0x6a3e946B83fDD9b2B6650D909332C42397FF774f",
    name: "fcTriCrypto/FRAX",
    underlyingAssetAddress: arbitrumConfig.wethTokenAddress,
  },
]

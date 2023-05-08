import { Address } from "wagmi"
import { arbitrum } from "wagmi/chains"

export type LendingPair = {
  pairAddress: Address
  chainId: number
  name: string
  collateralTokenName: string
  collateralTokenSymbol: string
}

type LendingPairsConfig = Array<LendingPair>

export const lendingPairs: LendingPairsConfig = [
  {
    chainId: arbitrum.id,
    pairAddress: "0xB900A00418bbD1A1b7e1b00A960A22EA540918a2",
    name: "FRAX/fcGLP",
    collateralTokenName: "Fortress Compounding GLP",
    collateralTokenSymbol: "fcGLP",
  },
]
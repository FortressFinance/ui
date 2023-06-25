import { Address } from "wagmi"
import { arbitrum } from "wagmi/chains"

export type LendingPair = {
  pairAddress: Address
  chainId: number
  name: string
}

type LendingPairsConfig = Array<LendingPair>

export const lendingPairs: LendingPairsConfig = [
  {
    chainId: arbitrum.id,
    pairAddress: "0xB900A00418bbD1A1b7e1b00A960A22EA540918a2",
    name: "fcGLP/FRAX",
  },
  {
    chainId: arbitrum.id,
    pairAddress: "0xf0888F34aa92A9dd427afc18CbaE0cbED9DcD6c8",
    name: "fcTriCrypto/FRAX",
  },
]

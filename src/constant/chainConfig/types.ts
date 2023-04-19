import { Address } from "wagmi"

export type ChainConfig = {
  registryAddress: Address
  lendingPairs: Array<Address>
}

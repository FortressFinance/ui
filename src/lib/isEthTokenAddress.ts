import { Address } from "wagmi"

import { ETH } from "@/constant/addresses"

export default function isEthTokenAddress(address: Address | undefined) {
  return address === ETH
}

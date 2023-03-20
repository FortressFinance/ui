import { Address } from "wagmi"

import { ethTokenAddress } from "@/constant/addresses"

export default function isEthTokenAddress(address: Address | undefined) {
  return address === ethTokenAddress
}

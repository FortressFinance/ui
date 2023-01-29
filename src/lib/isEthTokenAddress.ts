import { Address } from "wagmi"

export const ETH_TOKEN_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"

export default function isEthTokenAddress(address: Address | undefined) {
  return address === ETH_TOKEN_ADDRESS
}

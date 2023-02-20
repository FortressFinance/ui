import { Address } from "wagmi"

import { ETH_TOKEN_ADDRESS } from "@/lib/isEthTokenAddress"

// ! Mocked hook for use with new registry interface

export function useConcentratorTargetAssets(options: {
  onSuccess?: (data: Address[]) => void
}) {
  const data: Address[] = [
    "0x616e8BfA43F920657B3497DBf40D6b1A02D4608d",
    ETH_TOKEN_ADDRESS,
    "0x62B9c7356A2Dc64a1969e19C23e4f579F9810Aa7",
  ]
  options?.onSuccess?.(data)
  return {
    data,
    isLoading: false,
    isFetching: false,
  }
}

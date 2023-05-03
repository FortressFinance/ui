import { Address, useToken } from "wagmi"

import isEthTokenAddress from "@/lib/isEthTokenAddress"
import { useActiveChainId } from "@/hooks"

export function useTokenOrNative({
  address,
  chainId,
}: {
  address: Address | undefined
  chainId?: number
}) {
  const isEth = isEthTokenAddress(address)
  const activeChainId = useActiveChainId()
  const token = useToken({
    address,
    chainId: chainId ?? activeChainId,
    enabled: !isEth && address !== "0x",
  })
  if (isEth) {
    return {
      isError: false,
      isLoading: false,
      isFetching: false,
      isSuccess: true,
      data: {
        address: undefined,
        decimals: 18,
        name: "Ether",
        symbol: "ETH",
        totalSupply: undefined,
      },
    }
  } else {
    return token
  }
}

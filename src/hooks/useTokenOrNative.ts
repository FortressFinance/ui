import { Address, useToken } from "wagmi"

import isEthTokenAddress from "@/lib/isEthTokenAddress"
import useActiveChainId from "@/hooks/useActiveChainId"

export default function useTokenOrNative({
  address,
}: {
  address: Address | undefined
}) {
  const isEth = isEthTokenAddress(address)
  const chainId = useActiveChainId()
  const token = useToken({
    address,
    chainId,
    enabled: !isEth && address !== "0x",
  })
  if (isEth) {
    return {
      isError: false,
      isLoading: false,
      isFetching: false,
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

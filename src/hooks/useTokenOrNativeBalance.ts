import { Address, useAccount, useBalance } from "wagmi"

import isEthTokenAddress from "@/lib/isEthTokenAddress"
import useActiveChainId from "@/hooks/useActiveChainId"

export default function useTokenOrNativeBalance({
  address,
}: {
  address: Address | undefined
}) {
  const isEth = isEthTokenAddress(address)
  const chainId = useActiveChainId()
  const { address: userAddress } = useAccount()
  return useBalance({
    address: userAddress,
    chainId,
    token: isEth ? undefined : address,
    watch: true,
  })
}

import { Address, useAccount, useBalance } from "wagmi"

import isEthTokenAddress from "@/lib/isEthTokenAddress"
import { useActiveChainId } from "@/hooks"

export function useTokenOrNativeBalance({
  address,
  chainId,
  onSuccess,
}: {
  address: Address | undefined
  chainId?: number
  onSuccess?: () => void
}) {
  const isEth = isEthTokenAddress(address)
  const activeChainId = useActiveChainId()
  const { address: userAddress } = useAccount()
  return useBalance({
    address: userAddress,
    chainId: chainId ?? activeChainId,
    token: isEth ? undefined : address,
    enabled: address !== "0x",
    onSuccess,
  })
}

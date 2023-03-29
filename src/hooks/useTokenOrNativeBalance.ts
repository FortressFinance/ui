import { Address, useAccount, useBalance } from "wagmi"

import isEthTokenAddress from "@/lib/isEthTokenAddress"
import { useActiveChainId } from "@/hooks"

export function useTokenOrNativeBalance({
  address,
  onSuccess,
}: {
  address: Address | undefined
  onSuccess?: () => void
}) {
  const isEth = isEthTokenAddress(address)
  const chainId = useActiveChainId()
  const { address: userAddress } = useAccount()
  return useBalance({
    address: userAddress,
    chainId,
    token: isEth ? undefined : address,
    enabled: address !== "0x",
    onSuccess,
  })
}

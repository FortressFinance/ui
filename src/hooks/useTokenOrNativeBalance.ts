import { Address, useAccount, useBalance } from "wagmi"

import isEthTokenAddress from "@/lib/isEthTokenAddress"
import useActiveChainId from "@/hooks/useActiveChainId"

export default function useTokenOrNativeBalance({
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
    watch: true,
    enabled: address !== "0x",
    onSuccess,
  })
}

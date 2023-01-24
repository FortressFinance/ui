import { Address, useAccount, useBalance } from "wagmi"

import isEthTokenAddress from "@/lib/isEthTokenAddress"

export default function useTokenOrNativeBalance({
  address,
}: {
  address: Address | undefined
}) {
  const isEth = isEthTokenAddress(address)
  const { address: userAddress } = useAccount()
  return useBalance({
    address: userAddress,
    token: isEth ? undefined : address,
    watch: true,
  })
}

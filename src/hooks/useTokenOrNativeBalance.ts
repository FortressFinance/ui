import { Address, useAccount, useBalance } from "wagmi"

export default function useTokenOrNativeBalance({
  address,
}: {
  address: Address | undefined
}) {
  const isEth = address === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
  const { address: userAddress } = useAccount()
  return useBalance({
    address: userAddress,
    token: isEth ? undefined : address,
    watch: true,
  })
}

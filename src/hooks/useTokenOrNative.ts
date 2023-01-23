import { Address, useToken } from "wagmi"

export default function useTokenOrNative({
  address,
}: {
  address: Address | undefined
}) {
  const isEth = address === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
  const token = useToken({
    address,
    enabled: !isEth,
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

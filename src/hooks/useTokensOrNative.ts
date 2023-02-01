import { FetchBalanceResult, FetchTokenResult } from "@wagmi/core"
import { BigNumber } from "ethers"
import { formatUnits } from "ethers/lib/utils.js"
import {
  Address,
  erc20ABI,
  useAccount,
  useBalance,
  useContractReads,
} from "wagmi"

import isEthTokenAddress from "@/lib/isEthTokenAddress"
import useActiveChainId from "@/hooks/useActiveChainId"

type AggregatedTokensResult = FetchTokenResult & {
  balance: FetchBalanceResult
}

export default function useTokensOrNative({
  addresses = ["0x"],
}: {
  addresses: Address[] | readonly Address[] | undefined
}) {
  const chainId = useActiveChainId()
  const { address: userAddress } = useAccount()

  const nonEthAddresses = addresses.filter((a) => !isEthTokenAddress(a))
  const { data, ...tokensQuery } = useContractReads({
    contracts: nonEthAddresses.flatMap((address) => [
      { chainId, abi: erc20ABI, address, functionName: "decimals" },
      { chainId, abi: erc20ABI, address, functionName: "name" },
      { chainId, abi: erc20ABI, address, functionName: "symbol" },
      { chainId, abi: erc20ABI, address, functionName: "totalSupply" },
      {
        chainId,
        abi: erc20ABI,
        address,
        functionName: "balanceOf",
        args: [userAddress],
      },
    ]),
  })
  const { data: ethBalance } = useBalance({ chainId, address: userAddress })

  if (data && ethBalance) {
    let hasEthBeenInserted = false
    const numCallsPerAddress = 5
    const adjustedData: AggregatedTokensResult[] = []

    for (let i = 0; i < addresses.length; i++) {
      const address = addresses[i]

      if (isEthTokenAddress(address)) {
        hasEthBeenInserted = true
        adjustedData.push({
          address,
          decimals: 18,
          name: "Ether",
          symbol: "ETH",
          totalSupply: {
            formatted: "",
            value: BigNumber.from(0),
          },
          balance: ethBalance,
        })
      } else {
        const adjustedIndex = hasEthBeenInserted
          ? i * numCallsPerAddress - numCallsPerAddress
          : i * numCallsPerAddress
        const decimals = data[adjustedIndex] as number
        const name = data[adjustedIndex + 1] as string
        const symbol = data[adjustedIndex + 2] as string
        const totalSupply = data[adjustedIndex + 3] as BigNumber
        const value = data[adjustedIndex + 4] as BigNumber
        adjustedData.push({
          address,
          decimals,
          name,
          symbol,
          totalSupply: {
            formatted: totalSupply?.toString(),
            value: totalSupply,
          },
          balance: {
            decimals,
            formatted: formatUnits(value ?? "0", decimals ?? 0),
            symbol,
            value,
          },
        })
      }
    }

    return { data: adjustedData, ...tokensQuery }
  } else {
    return { data: undefined, ...tokensQuery }
  }
}

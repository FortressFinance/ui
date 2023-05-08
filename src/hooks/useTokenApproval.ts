import { BigNumber } from "ethers"
import {
  Address,
  erc20ABI,
  useAccount,
  useContractRead,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi"

import { useActiveChainId } from "@/hooks/useActiveChainId"

import { ethTokenAddress } from "@/constant/addresses"

export const useTokenApproval = ({
  amount,
  spender = "0x",
  token = "0x",
  enabled,
}: {
  amount: BigNumber
  spender?: Address
  token?: Address
  enabled: boolean
}) => {
  const isNativeToken = token === ethTokenAddress
  const chainId = useActiveChainId()
  const { address: owner = "0x" } = useAccount()
  const allowance = useContractRead({
    chainId,
    address: token,
    abi: erc20ABI,
    functionName: "allowance",
    args: [owner, spender],
    enabled:
      amount.gt(0) &&
      spender !== "0x" &&
      token !== "0x" &&
      !isNativeToken &&
      enabled,
  })
  const write = useContractWrite({
    mode: "recklesslyUnprepared",
    chainId,
    address: token,
    abi: erc20ABI,
    functionName: "approve",
    args: [spender, amount],
  })
  const wait = useWaitForTransaction({
    hash: write.data?.hash,
    onSuccess: () => allowance.refetch(),
  })
  return {
    isSufficient: isNativeToken ? true : allowance.data?.gte(amount) ?? false,
    allowance,
    write,
    wait,
  }
}

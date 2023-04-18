import { BigNumber } from "ethers"
import {
  Address,
  erc20ABI,
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi"

import { useActiveChainId } from "@/hooks/useActiveChainId"
import { useToast } from "@/hooks/useToast"

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
  const toastManager = useToast()
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
  const prepare = usePrepareContractWrite({
    chainId,
    address: token,
    abi: erc20ABI,
    functionName: "approve",
    args: [spender, amount],
    enabled:
      amount.gt(0) &&
      spender !== "0x" &&
      token !== "0x" &&
      !isNativeToken &&
      allowance.data?.lt(amount) &&
      enabled,
  })
  const write = useContractWrite(prepare.data)
  const wait = useWaitForTransaction({
    hash: write.data?.hash,
    onSettled: (receipt, error) =>
      error
        ? toastManager.error(
            "Approve transaction failed.",
            receipt?.transactionHash
          )
        : toastManager.success(
            "Approve transaction done successfully.",
            receipt?.transactionHash
          ),
    onSuccess: () => allowance.refetch(),
  })
  return {
    isSufficient: isNativeToken ? true : allowance.data?.gte(amount) ?? false,
    allowance,
    prepare,
    write,
    wait,
  }
}

import { BigNumber, ethers } from "ethers"
import {
  Address,
  erc20ABI,
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi"

type UseApproveTokenProps = {
  enabled?: boolean
  token: Address | undefined
  spender: Address | undefined
  value: BigNumber
}

export default function useApproveToken({
  enabled = true,
  token,
  spender,
  value,
}: UseApproveTokenProps) {
  const { address: userAddress } = useAccount()
  // Check token approval
  const allowance = useContractRead({
    abi: erc20ABI,
    address: token,
    functionName: "allowance",
    args: [userAddress ?? "0x", spender ?? "0x"],
    enabled: enabled && !!spender && !!token && !!userAddress,
    watch: true,
  })
  const isRequired = enabled ? allowance.data?.lt(value) ?? true : false
  // Configure approve method
  const prepareApprove = usePrepareContractWrite({
    abi: erc20ABI,
    address: token,
    functionName: "approve",
    args: [spender ?? "0x", ethers.constants.MaxUint256],
    enabled: enabled && !!spender && !!token && isRequired,
  })
  const writeApprove = useContractWrite(prepareApprove.config)
  const waitApprove = useWaitForTransaction({ hash: writeApprove.data?.hash })
  return {
    isRequired,
    isLoading:
      allowance.isLoading ||
      prepareApprove.isLoading ||
      writeApprove.isLoading ||
      waitApprove.isLoading,
    write: writeApprove.write,
  }
}

export type UseApproveTokenResult = ReturnType<typeof useApproveToken>

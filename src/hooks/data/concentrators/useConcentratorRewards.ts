import {
  Address,
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi"

import useActiveChainId from "@/hooks/useActiveChainId"

import { AMMConcentratorBase } from "@/constant/abi"

type ConcentratorRewardArgs = {
  concentratorAddress: Address | undefined
}

export function useConcentratorPendingReward({
  concentratorAddress: address,
}: ConcentratorRewardArgs) {
  const chainId = useActiveChainId()
  const { address: userAddress } = useAccount()
  return useContractRead({
    address,
    chainId,
    abi: AMMConcentratorBase,
    functionName: "pendingReward",
    args: [userAddress ?? "0x"],
    enabled: !!userAddress,
  })
}

export function useConcentratorClaim({
  concentratorAddress: address,
}: ConcentratorRewardArgs) {
  const chainId = useActiveChainId()
  const { address: userAddress } = useAccount()
  const prepareWrite = usePrepareContractWrite({
    address,
    chainId,
    abi: AMMConcentratorBase,
    functionName: "claim",
    enabled: !!userAddress,
    args: [userAddress ?? "0x", userAddress ?? "0x"],
  })
  const write = useContractWrite(prepareWrite.config)
  const waitWrite = useWaitForTransaction({ hash: write.data?.hash })
  return {
    error: prepareWrite.error || write.error,
    isError: prepareWrite.isError || write.isError,
    isLoading: prepareWrite.isLoading || write.isLoading || waitWrite.isLoading,
    write: write?.write,
  }
}

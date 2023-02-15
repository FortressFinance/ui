import {
  Address,
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi"

import useActiveChainId from "@/hooks/useActiveChainId"

import { concentratorAbi } from "@/constant/abi"

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
    abi: concentratorAbi,
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
    abi: concentratorAbi,
    functionName: "claim",
    enabled: !!userAddress,
  })
  const write = useContractWrite(prepareWrite.config)
  return {
    error: prepareWrite.error || write.error,
    isError: prepareWrite.isError || write.isError,
    isLoading: prepareWrite.isLoading || write.isLoading,
    write,
  }
}

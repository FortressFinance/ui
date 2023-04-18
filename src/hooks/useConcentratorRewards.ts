import { BigNumber } from "ethers"
import {
  Address,
  useAccount,
  useContractReads,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi"

import { useActiveChainId } from "@/hooks"

import { AMMConcentratorBase, MultiClaimer } from "@/constant/abi"

type ConcentratorRewardArgs = {
  targetAsset: Address
  ybTokenList: Address[]
}

export function useConcentratorPendingReward({
  ybTokenList,
}: {
  ybTokenList: ConcentratorRewardArgs["ybTokenList"]
}) {
  const chainId = useActiveChainId()
  const { address: userAddress } = useAccount()
  const contracts = ybTokenList.map((ybToken) => {
    return {
      address: ybToken,
      chainId,
      abi: AMMConcentratorBase,
      functionName: "pendingReward",
      args: [userAddress ?? "0x"],
    }
  })
  return useContractReads({
    contracts: contracts,
    enabled: !!userAddress && ybTokenList.length > 0,
    select: (data) =>
      data.map((reward) => {
        if (reward === undefined) {
          return BigNumber.from(0)
        }
        return BigNumber.from(reward)
      }),
  })
}

export function useConcentratorClaim({
  targetAsset,
  ybTokenList,
}: ConcentratorRewardArgs) {
  const chainId = useActiveChainId()
  const { address: userAddress } = useAccount()
  const prepareWrite = usePrepareContractWrite({
    address: targetAsset,
    chainId,
    abi: MultiClaimer,
    functionName: "multiClaim",
    args: [ybTokenList, userAddress ?? "0x"],
    enabled: !!userAddress && ybTokenList.length > 0,
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

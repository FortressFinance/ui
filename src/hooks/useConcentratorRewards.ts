import { useCallback } from "react"
import {
  Address,
  useAccount,
  useContractReads,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi"
import { shallow } from "zustand/shallow"

import { useActiveChainId, useTokenOrNativeBalance } from "@/hooks"

import { useToastStore } from "@/store"

import { AMMConcentratorBase, MultiClaimer } from "@/constant/abi"
import { multiClaimAddress } from "@/constant/addresses"

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
  const rewards = useContractReads({
    contracts: ybTokenList.map((ybToken) => ({
      address: ybToken,
      chainId,
      abi: AMMConcentratorBase,
      functionName: "pendingReward",
      args: [userAddress ?? "0x"],
    })),
    enabled: !!userAddress && ybTokenList.length > 0,
    select: (results) =>
      results.map((item) => (item.result ?? BigInt(0)) as bigint),
  })
  return rewards
}

export function useConcentratorClaim({
  targetAsset,
  ybTokenList,
}: ConcentratorRewardArgs) {
  const chainId = useActiveChainId()
  const { address: userAddress } = useAccount()
  const [addToast, replaceToast] = useToastStore(
    (state) => [state.addToast, state.replaceToast],
    shallow
  )
  const rewardsBalance = useConcentratorPendingReward({
    ybTokenList: ybTokenList ?? [],
  })
  const balance = useTokenOrNativeBalance({
    address: targetAsset,
    chainId,
  })
  const onClaimSuccess = () => {
    rewardsBalance.refetch()
    balance.refetch()
  }
  const ybTokenListWithRewards = ybTokenList.filter((_ybToken, index) =>
    rewardsBalance.data?.[index]?.gt(0)
  )
  const prepareWrite = usePrepareContractWrite({
    address: multiClaimAddress,
    chainId,
    abi: MultiClaimer,
    functionName: "multiClaim",
    args: [ybTokenListWithRewards, userAddress ?? "0x"],
    enabled:
      !!userAddress &&
      ybTokenListWithRewards.length > 0 &&
      targetAsset !== "0x",
  })
  const writeClaim = useContractWrite(prepareWrite.config)
  useWaitForTransaction({
    hash: writeClaim.data?.hash,
    onSuccess: () => onClaimSuccess(),
  })
  const writeExecute = useCallback(() => {
    const action = "Claim"
    const toastId = addToast({ type: "startTx", action })
    writeClaim
      .writeAsync?.()
      .then((receipt) => {
        // this fires after the transaction has been broadcast successfully
        replaceToast(toastId, { type: "waitTx", hash: receipt.hash, action })
      })
      .catch((error) =>
        replaceToast(toastId, { type: "errorWrite", error, action })
      )
  }, [addToast, replaceToast, writeClaim])
  return {
    error: prepareWrite.error || writeClaim.error,
    isError: prepareWrite.isError || writeClaim.isError,
    isLoading:
      prepareWrite.isLoading ||
      writeClaim.isLoading ||
      writeClaim.isLoading ||
      rewardsBalance.isLoading ||
      balance.isLoading,
    write: writeExecute,
  }
}

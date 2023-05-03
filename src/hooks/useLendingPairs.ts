import { BigNumber } from "ethers"
import _ from "lodash"
import {
  Address,
  useAccount,
  useContractRead,
  useContractReads,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi"

import { useToast } from "@/hooks/useToast"
import { useTokenOrNativeBalance } from "@/hooks/useTokenOrNativeBalance"

import { lendingPairs } from "@/constant"
import { FortressLendingPair } from "@/constant/abi"

export const useLendingPairs = ({ chainId }: { chainId?: number }) => {
  const chainLendingPairs = lendingPairs.filter((p) => p.chainId === chainId)
  const lendingPairsData = useContractReads({
    contracts: chainLendingPairs.flatMap(({ chainId, pairAddress }) => [
      {
        chainId,
        address: pairAddress,
        abi: FortressLendingPair,
        functionName: "name",
      },
      {
        chainId,
        address: pairAddress,
        abi: FortressLendingPair,
        functionName: "assetContract",
      },
      {
        chainId,
        address: pairAddress,
        abi: FortressLendingPair,
        functionName: "collateralContract",
      },
      {
        chainId,
        address: pairAddress,
        abi: FortressLendingPair,
        functionName: "maxLTV",
      },
      {
        chainId,
        address: pairAddress,
        abi: FortressLendingPair,
        functionName: "totalAssets",
      },
    ]),
    select: (results) =>
      _.chunk(results, 5).map(
        (
          [name, assetContract, collateralContract, maxLTV, totalAssets],
          index
        ) => ({
          pairAddress: chainLendingPairs[index].pairAddress,
          name: name as string,
          assetContract: assetContract as Address,
          collateralContract: collateralContract as Address,
          maxLTV: maxLTV as BigNumber,
          totalAssets: totalAssets as BigNumber,
        })
      ),
    enabled: !!chainId && chainLendingPairs.length > 0,
  })
  return chainLendingPairs.length > 0
    ? lendingPairsData
    : { ...lendingPairsData, data: [] }
}

export const useLendingPair = ({
  chainId,
  pairAddress,
}: {
  chainId: number
  pairAddress: Address
}) => {
  const lendingPairs = useLendingPairs({ chainId })
  return {
    ...lendingPairs,
    data: lendingPairs.data?.find((p) => p.pairAddress === pairAddress),
  }
}

export const useLendingDepositPreview = ({
  amount,
  chainId,
  pairAddress,
  enabled = true,
}: {
  amount: BigNumber
  chainId: number
  pairAddress: Address
  enabled?: boolean
}) => {
  return useContractRead({
    chainId,
    address: pairAddress,
    abi: FortressLendingPair,
    functionName: "previewDeposit",
    args: [amount],
    enabled: enabled && !!chainId,
  })
}

export const useLendingRedeemPreview = ({
  amount,
  chainId,
  pairAddress,
  enabled = true,
}: {
  amount: BigNumber
  chainId: number
  pairAddress: Address
  enabled?: boolean
}) => {
  return useContractRead({
    chainId,
    address: pairAddress,
    abi: FortressLendingPair,
    functionName: "previewRedeem",
    args: [amount],
    enabled: enabled && !!chainId,
  })
}

export const useLendingDeposit = ({
  amount,
  assetAddress,
  chainId,
  pairAddress,
  enabled = true,
  onSuccess,
}: {
  amount: BigNumber
  assetAddress?: Address
  chainId: number
  pairAddress: Address
  enabled?: boolean
  onSuccess: () => void
}) => {
  const toastManager = useToast()
  const { address: receiver = "0x" } = useAccount()
  const assetBalance = useTokenOrNativeBalance({ address: assetAddress })
  const shareBalance = useTokenOrNativeBalance({ address: pairAddress })
  const prepare = usePrepareContractWrite({
    chainId,
    address: pairAddress,
    abi: FortressLendingPair,
    functionName: "deposit",
    args: [amount, receiver],
    enabled: !!chainId && amount.gt(0) && receiver !== "0x" && enabled,
  })
  const write = useContractWrite(prepare.data)
  const wait = useWaitForTransaction({
    hash: write.data?.hash,
    onSettled: (receipt, error) =>
      error
        ? toastManager.error(
            "Deposit transaction failed.",
            receipt?.transactionHash
          )
        : toastManager.success(
            "Deposit transaction done successfully.",
            receipt?.transactionHash
          ),
    onSuccess: () => {
      assetBalance.refetch()
      shareBalance.refetch()
      onSuccess()
    },
  })
  return { prepare, write, wait }
}

export const useLendingRedeem = ({
  amount,
  assetAddress,
  chainId,
  pairAddress,
  enabled = true,
  onSuccess,
}: {
  amount: BigNumber
  assetAddress?: Address
  chainId: number
  pairAddress: Address
  enabled?: boolean
  onSuccess: () => void
}) => {
  const toastManager = useToast()
  const { address: receiver = "0x" } = useAccount()
  const assetBalance = useTokenOrNativeBalance({ address: assetAddress })
  const shareBalance = useTokenOrNativeBalance({ address: pairAddress })
  const prepare = usePrepareContractWrite({
    chainId,
    address: pairAddress,
    abi: FortressLendingPair,
    functionName: "redeem",
    args: [amount, receiver, receiver],
    enabled: !!chainId && amount.gt(0) && receiver !== "0x" && enabled,
  })
  const write = useContractWrite(prepare.data)
  const wait = useWaitForTransaction({
    hash: write.data?.hash,
    onSettled: (receipt, error) =>
      error
        ? toastManager.error(
            "Withdraw transaction failed.",
            receipt?.transactionHash
          )
        : toastManager.success(
            "Withdraw transaction done successfully.",
            receipt?.transactionHash
          ),
    onSuccess: () => {
      assetBalance.refetch()
      shareBalance.refetch()
      onSuccess()
    },
  })
  return { prepare, write, wait }
}

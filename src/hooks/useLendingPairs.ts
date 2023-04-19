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

import { useActiveChainConfig } from "@/hooks/useActiveChainConfig"
import { useActiveChainId } from "@/hooks/useActiveChainId"
import { useToast } from "@/hooks/useToast"
import { useTokenOrNativeBalance } from "@/hooks/useTokenOrNativeBalance"

import { FortressLendingPair } from "@/constant/abi"

export const useLendingPairs = () => {
  const chainId = useActiveChainId()
  const chainConfig = useActiveChainConfig()
  const lendingPairs = useContractReads({
    contracts: chainConfig.lendingPairs.flatMap((pairAddress) => [
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
          pairAddress: chainConfig.lendingPairs[index],
          name: name as string,
          assetContract: assetContract as Address,
          collateralContract: collateralContract as Address,
          maxLTV: maxLTV as BigNumber,
          totalAssets: totalAssets as BigNumber,
        })
      ),
    enabled: chainConfig.lendingPairs.length > 0,
  })
  return chainConfig.lendingPairs.length > 0
    ? lendingPairs
    : { ...lendingPairs, data: [] }
}

export const useLendingPair = ({ pairAddress }: { pairAddress: Address }) => {
  const lendingPairs = useLendingPairs()
  return {
    ...lendingPairs,
    data: lendingPairs.data?.find((p) => p.pairAddress === pairAddress),
  }
}

export const useLendingDepositPreview = ({
  amount,
  pairAddress,
  enabled = true,
}: {
  amount: BigNumber
  pairAddress: Address
  enabled?: boolean
}) => {
  const chainId = useActiveChainId()
  return useContractRead({
    chainId,
    address: pairAddress,
    abi: FortressLendingPair,
    functionName: "previewDeposit",
    args: [amount],
    enabled,
  })
}

export const useLendingRedeemPreview = ({
  amount,
  pairAddress,
  enabled = true,
}: {
  amount: BigNumber
  pairAddress: Address
  enabled?: boolean
}) => {
  const chainId = useActiveChainId()
  return useContractRead({
    chainId,
    address: pairAddress,
    abi: FortressLendingPair,
    functionName: "previewRedeem",
    args: [amount],
    enabled,
  })
}

export const useLendingDeposit = ({
  amount,
  assetAddress,
  pairAddress,
  enabled = true,
  onSuccess,
}: {
  amount: BigNumber
  assetAddress?: Address
  pairAddress: Address
  enabled?: boolean
  onSuccess: () => void
}) => {
  const chainId = useActiveChainId()
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
    enabled: amount.gt(0) && receiver !== "0x" && enabled,
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
  pairAddress,
  enabled = true,
  onSuccess,
}: {
  amount: BigNumber
  assetAddress?: Address
  pairAddress: Address
  enabled?: boolean
  onSuccess: () => void
}) => {
  const chainId = useActiveChainId()
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
    enabled: amount.gt(0) && receiver !== "0x" && enabled,
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

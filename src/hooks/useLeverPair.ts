import { parseUnits, zeroAddress } from "viem"
import {
  Address,
  useAccount,
  useContractRead,
  useContractReads,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi"

import { addSlippage } from "@/lib"
import { useActiveChainId } from "@/hooks/useActiveChainId"
import { useTokenOrNative } from "@/hooks/useTokenOrNative"

import { useToastStore } from "@/store"

import { FortressLendingPair } from "@/constant/abi"

// We add a 0.005% buffer to the borrow amount to account for inaccuracy in the conversion to/from assets/shares
export const BORROW_BUFFER_PERCENTAGE = 0.005

export const useLeverPair = ({
  pairAddress,
  chainId,
}: {
  pairAddress: Address
  chainId?: number
}) => {
  const { address: userAddress = zeroAddress } = useAccount()
  const accounting = useContractReads({
    contracts: [
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
        functionName: "currentRateInfo",
      },
      {
        chainId,
        address: pairAddress,
        abi: FortressLendingPair,
        functionName: "exchangeRateInfo",
      },
      {
        chainId,
        address: pairAddress,
        abi: FortressLendingPair,
        functionName: "getConstants",
      },
      {
        chainId,
        address: pairAddress,
        abi: FortressLendingPair,
        functionName: "totalAssets",
      },
      {
        chainId,
        address: pairAddress,
        abi: FortressLendingPair,
        functionName: "totalBorrow",
      },
      {
        chainId,
        address: pairAddress,
        abi: FortressLendingPair,
        functionName: "userBorrowShares",
        args: [userAddress],
      },
      {
        chainId,
        address: pairAddress,
        abi: FortressLendingPair,
        functionName: "userCollateralBalance",
        args: [userAddress],
      },
    ],
    enabled: !!chainId && !!pairAddress,
    select: (results) => {
      const [
        { result: maxLTV },
        { result: currentRateInfo },
        { result: exchangeRateInfo },
        { result: constants },
        { result: totalAssets },
        { result: totalBorrow },
        { result: userBorrowShares },
        { result: userCollateralBalance },
      ] = results
      const [
        currRateLastBlock,
        currRateFeeToProtocolRate,
        currRateLastTimestamp,
        currRateRatePerSec,
      ] = currentRateInfo ?? []
      const [exRateLastTimestamp, exRateExchangeRate] = exchangeRateInfo ?? []
      const [
        ltvPrecision,
        liqPrecision,
        utilPrecision,
        feePrecision,
        exchangePrecision,
        defaultInt,
        defaultProtocolFee,
        maxProtocolFee,
      ] = constants ?? []
      const [totalBorrowAmount, totalBorrowShares] = totalBorrow ?? []
      return {
        constants: {
          ltvPrecision,
          liqPrecision,
          utilPrecision,
          feePrecision,
          exchangePrecision,
          defaultInt,
          defaultProtocolFee,
          maxProtocolFee,
        },
        currentRateInfo: {
          lastBlock: currRateLastBlock,
          feeToProtocolRate: currRateFeeToProtocolRate,
          lastTimestamp: currRateLastTimestamp,
          ratePerSec: currRateRatePerSec,
        },
        exchangeRate: {
          lastTimestamp: exRateLastTimestamp,
          exchangeRate: exRateExchangeRate,
        },
        maxLTV,
        totalAssets,
        totalBorrowAmount,
        totalBorrowShares,
        userBorrowShares,
        userCollateralBalance,
      }
    },
  })
  const borrowedAmount = useContractRead({
    chainId,
    address: pairAddress,
    abi: FortressLendingPair,
    functionName: "convertToAssets",
    args: [
      accounting.data?.totalBorrowAmount ?? 0n,
      accounting.data?.totalBorrowShares ?? 0n,
      accounting.data?.userBorrowShares ?? 0n,
      true,
    ],
    enabled:
      accounting.isSuccess &&
      !!accounting.data?.totalBorrowAmount &&
      !!accounting.data.totalBorrowShares &&
      !!accounting.data.userBorrowShares,
  })
  return {
    isLoading: accounting.isLoading || borrowedAmount.isLoading,
    isFetching: accounting.isFetching || borrowedAmount.isFetching,
    isError: accounting.isError || borrowedAmount.isError,
    isSuccess: accounting.isSuccess && borrowedAmount.isSuccess,
    data: {
      constants: accounting.data?.constants,
      exchangeRate: accounting.data?.exchangeRate.exchangeRate,
      interestAccruedAt: Number(
        accounting.data?.currentRateInfo.lastTimestamp ?? 0
      ),
      interestRatePerSecond: accounting.data?.currentRateInfo.ratePerSec,
      maxLTV: accounting.data?.maxLTV,
      borrowedAmount: borrowedAmount.data,
      borrowedAmountWithBuffer: addSlippage(
        borrowedAmount.data,
        BORROW_BUFFER_PERCENTAGE
      ),
      borrowedShares: accounting.data?.userBorrowShares,
      collateralAmount: accounting.data?.userCollateralBalance,
      totalAssets: accounting.data?.totalAssets,
      totalBorrowAmount: accounting.data?.totalBorrowAmount,
      totalBorrowAmountWithBuffer: addSlippage(
        accounting.data?.totalBorrowAmount,
        BORROW_BUFFER_PERCENTAGE
      ),
      totalBorrowShares: accounting.data?.totalBorrowShares,
    },
    refetch: accounting.refetch,
  }
}

export const useLeverPosition = ({
  borrowAmount = 0n,
  borrowAssetAddress = zeroAddress,
  collateralAmount = 0n,
  enabled = true,
  minAmount,
  pairAddress,
  onSuccess,
}: {
  borrowAmount?: bigint
  borrowAssetAddress?: Address
  collateralAmount?: bigint
  enabled?: boolean
  minAmount: bigint
  pairAddress: Address
  onSuccess?: () => void
}) => {
  const addToast = useToastStore((store) => store.addToast)
  const chainId = useActiveChainId()
  const prepare = usePrepareContractWrite({
    chainId,
    address: pairAddress,
    abi: FortressLendingPair,
    functionName: "leveragePosition",
    args: [borrowAmount, collateralAmount, minAmount, borrowAssetAddress],
    enabled: borrowAmount > 0 && collateralAmount > 0 && enabled,
    onError: (error) => {
      if (error.message.includes("AlreadyCalledOnBlock")) {
        addToast({
          type: "errorSpeedBump",
          action: "Levered position creation",
        })
      }
    },
  })
  const write = useContractWrite(prepare.config)
  const wait = useWaitForTransaction({
    hash: write.data?.hash,
    onSuccess,
  })
  return { prepare, write, wait }
}

export const useAddCollateral = ({
  collateralAmount = 0n,
  enabled = true,
  pairAddress,
  onSuccess,
}: {
  collateralAmount?: bigint
  enabled?: boolean
  pairAddress: Address
  onSuccess?: () => void
}) => {
  const addToast = useToastStore((store) => store.addToast)
  const chainId = useActiveChainId()
  const { address: borrower = "0x" } = useAccount()
  const prepare = usePrepareContractWrite({
    chainId,
    address: pairAddress,
    abi: FortressLendingPair,
    functionName: "addCollateral",
    args: [collateralAmount, borrower],
    enabled: collateralAmount > 0 && borrower !== "0x" && enabled,
    onError: (error) => {
      if (error.message.includes("AlreadyCalledOnBlock")) {
        addToast({
          type: "errorSpeedBump",
          action: "Collateral deposit",
        })
      }
    },
  })
  const write = useContractWrite(prepare.config)
  const wait = useWaitForTransaction({
    hash: write.data?.hash,
    onSuccess,
  })
  return { prepare, write, wait }
}

export const useRemoveCollateral = ({
  collateralAmount = 0n,
  enabled = true,
  pairAddress,
  onSuccess,
}: {
  collateralAmount?: bigint
  enabled?: boolean
  pairAddress: Address
  onSuccess?: () => void
}) => {
  const addToast = useToastStore((store) => store.addToast)
  const chainId = useActiveChainId()
  const { address: borrower = "0x" } = useAccount()
  const prepare = usePrepareContractWrite({
    chainId,
    address: pairAddress,
    abi: FortressLendingPair,
    functionName: "removeCollateral",
    args: [collateralAmount, borrower],
    enabled: collateralAmount > 0 && borrower !== "0x" && enabled,
    onError: (error) => {
      if (error.message.includes("AlreadyCalledOnBlock")) {
        addToast({
          type: "errorSpeedBump",
          action: "Collateral removal",
        })
      }
    },
  })
  const write = useContractWrite(prepare.config)
  const wait = useWaitForTransaction({
    hash: write.data?.hash,
    onSuccess,
  })
  return { prepare, write, wait }
}

export const useRepayAsset = ({
  shares = 0n,
  enabled = true,
  pairAddress,
  onSuccess,
  onPrepareError,
}: {
  shares?: bigint
  enabled?: boolean
  pairAddress: Address
  onSuccess?: () => void
  onPrepareError?: (error: Error) => void
}) => {
  const addToast = useToastStore((store) => store.addToast)
  const chainId = useActiveChainId()
  const { address: borrower = "0x" } = useAccount()
  const prepare = usePrepareContractWrite({
    chainId,
    address: pairAddress,
    abi: FortressLendingPair,
    functionName: "repayAsset",
    args: [shares, borrower],
    enabled: enabled && shares > 0 && borrower !== "0x",
    onError: (error) => {
      if (error.message.includes("AlreadyCalledOnBlock")) {
        addToast({
          type: "errorSpeedBump",
          action: "Repayment",
        })
      }
      onPrepareError?.(error)
    },
  })
  const write = useContractWrite(prepare.config)
  const wait = useWaitForTransaction({
    hash: write.data?.hash,
    onSuccess,
  })
  return { prepare, write, wait }
}

export const useRepayAssetWithCollateral = ({
  borrowAssetAddress = "0x",
  collateralAmount = 0n,
  minAmount = 0n,
  enabled = true,
  pairAddress,
  onSuccess,
}: {
  borrowAssetAddress?: Address
  collateralAmount?: bigint
  minAmount?: bigint
  enabled?: boolean
  pairAddress: Address
  onSuccess?: () => void
}) => {
  const addToast = useToastStore((store) => store.addToast)
  const chainId = useActiveChainId()
  const prepare = usePrepareContractWrite({
    chainId,
    address: pairAddress,
    abi: FortressLendingPair,
    functionName: "repayAssetWithCollateral",
    args: [collateralAmount, minAmount, borrowAssetAddress],
    enabled: enabled && collateralAmount > 0 && borrowAssetAddress !== "0x",
    onError: (error) => {
      if (error.message.includes("AlreadyCalledOnBlock")) {
        addToast({
          type: "errorSpeedBump",
          action: "Repayment with collateral",
        })
      }
    },
  })
  const write = useContractWrite(prepare.config)
  const wait = useWaitForTransaction({
    hash: write.data?.hash,
    onSuccess,
  })
  return { prepare, write, wait }
}

export const useSignificantLeverAmount = ({
  amount = 0n,
  assetAddress = "0x",
}: {
  amount?: bigint
  assetAddress?: Address
}) => {
  const asset = useTokenOrNative({ address: assetAddress })
  return amount > parseUnits("0.0001", asset.data?.decimals ?? 18) ? amount : 0n
}

export const useConvertToShares = ({
  amount = 0n,
  enabled = true,
  totalBorrowAmount = 0n,
  totalBorrowShares = 0n,
  pairAddress,
}: {
  amount?: bigint
  enabled?: boolean
  totalBorrowAmount?: bigint
  totalBorrowShares?: bigint
  pairAddress: Address
}) => {
  const chainId = useActiveChainId()
  return useContractRead({
    chainId,
    address: pairAddress,
    abi: FortressLendingPair,
    functionName: "convertToShares",
    args: [totalBorrowAmount, totalBorrowShares, amount, false],
    enabled: enabled && amount > 0,
    cacheOnBlock: true,
  })
}

export const useConvertToAssets = ({
  shares = 0n,
  totalBorrowAmount = 0n,
  totalBorrowShares = 0n,
  pairAddress,
}: {
  shares?: bigint
  totalBorrowAmount?: bigint
  totalBorrowShares?: bigint
  pairAddress: Address
}) => {
  const chainId = useActiveChainId()
  return useContractRead({
    chainId,
    address: pairAddress,
    abi: FortressLendingPair,
    functionName: "convertToAssets",
    args: [totalBorrowAmount, totalBorrowShares, shares, true],
    enabled: shares > 0,
    cacheOnBlock: true,
  })
}

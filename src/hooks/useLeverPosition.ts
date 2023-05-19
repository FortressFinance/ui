import { BigNumber } from "ethers"
import { parseUnits } from "ethers/lib/utils.js"
import { zeroAddress } from "viem"
import {
  Address,
  useAccount,
  useContractRead,
  useContractReads,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi"

import { useActiveChainId } from "@/hooks/useActiveChainId"
import { useTokenOrNative } from "@/hooks/useTokenOrNative"

import { FortressLendingPair } from "@/constant/abi"

export const usePairLeverParams = ({
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
      accounting.data?.totalBorrowAmount ?? BigInt(0),
      accounting.data?.totalBorrowShares ?? BigInt(0),
      accounting.data?.userBorrowShares ?? BigInt(0),
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
      interestRatePerSecond: accounting.data?.currentRateInfo.ratePerSec,
      maxLTV: accounting.data?.maxLTV,
      borrowedAmount: borrowedAmount.data,
      borrowedShares: accounting.data?.userBorrowShares,
      collateralAmount: accounting.data?.userCollateralBalance,
      totalAssets: accounting.data?.totalAssets,
      totalBorrowAmount: accounting.data?.totalBorrowAmount,
      totalBorrowShares: accounting.data?.totalBorrowShares,
    },
    refetch: accounting.refetch,
  }
}

export const useLeverPosition = ({
  borrowAmount = BigInt(0),
  borrowAssetAddress = zeroAddress,
  collateralAmount = BigInt(0),
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
  const chainId = useActiveChainId()
  const prepare = usePrepareContractWrite({
    chainId,
    address: pairAddress,
    abi: FortressLendingPair,
    functionName: "leveragePosition",
    args: [borrowAmount, collateralAmount, minAmount, borrowAssetAddress],
    enabled: borrowAmount > 0 && collateralAmount > 0 && enabled,
  })
  const write = useContractWrite(prepare.config)
  const wait = useWaitForTransaction({
    hash: write.data?.hash,
    // TODO: wagmiv1 onSuccess
    onSuccess,
  })
  return { prepare, write, wait }
}

export const useAddCollateral = ({
  collateralAmount = BigInt(0),
  enabled = true,
  pairAddress,
  onSuccess,
}: {
  collateralAmount?: bigint
  enabled?: boolean
  pairAddress: Address
  onSuccess?: () => void
}) => {
  const chainId = useActiveChainId()
  const { address: borrower = "0x" } = useAccount()
  const prepare = usePrepareContractWrite({
    chainId,
    address: pairAddress,
    abi: FortressLendingPair,
    functionName: "addCollateral",
    args: [collateralAmount, borrower],
    enabled: collateralAmount > 0 && borrower !== "0x" && enabled,
  })
  const write = useContractWrite(prepare.config)
  const wait = useWaitForTransaction({
    hash: write.data?.hash,
    // TODO: wagmiv1 onSuccess
    onSuccess,
  })
  return { prepare, write, wait }
}

export const useRemoveCollateral = ({
  collateralAmount = BigInt(0),
  enabled = true,
  pairAddress,
  onSuccess,
}: {
  collateralAmount?: bigint
  enabled?: boolean
  pairAddress: Address
  onSuccess?: () => void
}) => {
  const chainId = useActiveChainId()
  const { address: borrower = "0x" } = useAccount()
  const prepare = usePrepareContractWrite({
    chainId,
    address: pairAddress,
    abi: FortressLendingPair,
    functionName: "removeCollateral",
    args: [collateralAmount, borrower],
    enabled: collateralAmount > 0 && borrower !== "0x" && enabled,
  })
  const write = useContractWrite(prepare.config)
  const wait = useWaitForTransaction({
    hash: write.data?.hash,
    // TODO: wagmiv1 onSuccess
    onSuccess,
  })
  return { prepare, write, wait }
}

export const useRepayAsset = ({
  shares = BigInt(0),
  enabled = true,
  pairAddress,
  onSuccess,
}: {
  shares?: bigint
  enabled?: boolean
  pairAddress: Address
  onSuccess?: () => void
}) => {
  const chainId = useActiveChainId()
  const { address: borrower = "0x" } = useAccount()
  const prepare = usePrepareContractWrite({
    chainId,
    address: pairAddress,
    abi: FortressLendingPair,
    functionName: "repayAsset",
    args: [shares, borrower],
    enabled: enabled && shares > 0 && borrower !== "0x",
  })
  const write = useContractWrite(prepare.config)
  const wait = useWaitForTransaction({
    hash: write.data?.hash,
    // TODO: wagmiv1 onSuccess
    onSuccess,
  })
  return { prepare, write, wait }
}

export const useRepayAssetWithCollateral = ({
  borrowAssetAddress = "0x",
  collateralAmount = BigInt(0),
  minAmount = BigInt(0),
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
  const chainId = useActiveChainId()
  const prepare = usePrepareContractWrite({
    chainId,
    address: pairAddress,
    abi: FortressLendingPair,
    functionName: "repayAssetWithCollateral",
    args: [collateralAmount, minAmount, borrowAssetAddress],
    enabled: enabled && collateralAmount > 0 && borrowAssetAddress !== "0x",
  })
  const write = useContractWrite(prepare.config)
  const wait = useWaitForTransaction({
    hash: write.data?.hash,
    // TODO: wagmiv1 onSuccess
    onSuccess,
  })
  return { prepare, write, wait }
}

export const useSignificantLeverAmount = ({
  amount = BigNumber.from(0),
  assetAddress = "0x",
}: {
  amount?: BigNumber
  assetAddress?: Address
}) => {
  const asset = useTokenOrNative({ address: assetAddress })
  return amount.gt(parseUnits("0.0001", asset.data?.decimals ?? 18))
    ? amount
    : BigNumber.from(0)
}

export const useConvertToShares = ({
  amount = BigInt(0),
  enabled = true,
  totalBorrowAmount = BigInt(0),
  totalBorrowShares = BigInt(0),
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
  })
}

export const useConvertToAssets = ({
  shares = BigInt(0),
  totalBorrowAmount = BigInt(0),
  totalBorrowShares = BigInt(0),
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
    args: [totalBorrowAmount, totalBorrowShares, shares, false],
    enabled: shares > 0,
  })
}

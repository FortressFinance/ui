import { BigNumber } from "ethers"
import { Address, useAccount, useContractRead, useContractReads } from "wagmi"

import { useActiveChainId } from "@/hooks/useActiveChainId"

import { FortressLendingPair } from "@/constant/abi"

export const useLeverPosition = ({ pairAddress }: { pairAddress: Address }) => {
  const chainId = useActiveChainId()
  const { address: userAddress = "0x" } = useAccount()
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
    enabled: userAddress !== "0x",
    select: ([
      maxLTV,
      [lastTimestamp, exchangeRate],
      [
        ltvPrecision,
        liqPrecision,
        utilPrecision,
        feePrecision,
        exchangePrecision,
        defaultInt,
        defaultProtocolFee,
        maxProtocolFee,
      ],
      [totalBorrowAmount, totalBorrowShares],
      userBorrowShares,
      userCollateralBalance,
    ]) => ({
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
      exchangeRate: {
        lastTimestamp,
        exchangeRate,
      },
      maxLTV,
      totalBorrowAmount,
      totalBorrowShares,
      userBorrowShares,
      userCollateralBalance,
    }),
  })
  const borrowedAmount = useContractRead({
    chainId,
    address: pairAddress,
    abi: FortressLendingPair,
    functionName: "convertToAssets",
    args: [
      accounting.data?.totalBorrowAmount ?? BigNumber.from(0),
      accounting.data?.totalBorrowShares ?? BigNumber.from(0),
      accounting.data?.userBorrowShares ?? BigNumber.from(0),
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
      maxLTV: accounting.data?.maxLTV,
      borrowedAmount: borrowedAmount.data,
      collateralAmount: accounting.data?.userCollateralBalance,
    },
  }
}

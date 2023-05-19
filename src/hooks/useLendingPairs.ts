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
      _.chunk(results, 5).map((resultsChunk, index) => {
        const [name, assetContract, collateralContract, maxLTV, totalAssets] =
          resultsChunk
        return {
          pairAddress: chainLendingPairs[index].pairAddress,
          name: name.status === "success" ? (name.result as string) : undefined,
          assetContract:
            assetContract.status === "success"
              ? (assetContract.result as Address)
              : undefined,
          collateralContract:
            collateralContract.status === "success"
              ? (collateralContract.result as Address)
              : undefined,
          maxLTV:
            maxLTV.status === "success" ? (maxLTV.result as bigint) : undefined,
          totalAssets:
            totalAssets.status === "success"
              ? (totalAssets.result as bigint)
              : undefined,
        }
      }),
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
    onSuccess: () => {
      assetBalance.refetch()
      shareBalance.refetch()
      onSuccess()
    },
  })
  return { prepare, write, wait }
}

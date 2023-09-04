/* eslint-disable @typescript-eslint/no-explicit-any */
import { zeroAddress } from "viem"
import { useAccount, useContractRead } from "wagmi"

import { VaultProps } from "@/lib/types"
import {
  useArbitrumDepositLogs,
  useArbitrumTransferLogs,
  useArbitrumWithdrawLogs,
} from "@/hooks"
import { useVaultContract } from "@/hooks/lib/useVaultContract"
import { useTokenPriceUsd } from "@/hooks/useTokenPriceUsd"
import { useIsTokenVault } from "@/hooks/useVaultTypes"

export default function useVaultUserEarningsFallback({
  asset,
  vaultAddress,
  type,
  enabled,
}: Pick<VaultProps, "asset" | "vaultAddress" | "type"> & {
  enabled?: boolean
}) {
  const isToken = useIsTokenVault(type)

  const earnedCompounder = useCompounderVaultUserEarningsFallback({
    asset,
    vaultAddress,
    enabled: !isToken && enabled,
  })
  const earnedToken = useTokenVaultUserEarningsFallback({
    asset,
    vaultAddress,
    enabled: isToken && enabled,
  })

  return isToken ? earnedToken : earnedCompounder
}

function useCompounderVaultUserEarningsFallback({
  asset,
  vaultAddress,
  enabled,
}: Pick<VaultProps, "asset" | "vaultAddress"> & {
  enabled?: boolean
}) {
  const { isConnected, address: userAddress } = useAccount()
  const balanceOf = useContractRead({
    ...useVaultContract(vaultAddress),
    enabled: !!asset && !!userAddress && enabled,
    functionName: "balanceOf",
    args: [userAddress ?? "0x"],
  })

  const primaryAssetShare = useContractRead({
    ...useVaultContract(vaultAddress),
    enabled: balanceOf.isSuccess && enabled,
    functionName: "convertToAssets",
    args: [balanceOf.data ?? 0n],
  })

  const depositLogs = useArbitrumDepositLogs({
    address: vaultAddress,
    userAddress,
  })
  const withdrawLogs = useArbitrumWithdrawLogs({
    address: vaultAddress,
    userAddress,
  })
  const transferLogs = useArbitrumTransferLogs({
    address: vaultAddress,
    userAddress,
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let netDeposited = depositLogs.data
    ?.filter((x: any) => x["args"]["_caller"] === userAddress)
    .map((x: any) => x["args"]["_shares"])
    .reduce(
      (accumulator: any, currentValue: any) => accumulator + currentValue,
      0n
    )

  netDeposited = withdrawLogs.data
    ?.filter((x: any) => x["args"]["_caller"] === userAddress)
    .map((x: any) => x["args"]["_shares"])
    .reduce(
      (accumulator: any, currentValue: any) => accumulator - currentValue,
      netDeposited
    )

  netDeposited = transferLogs.data
    ?.filter(
      (x: any) =>
        x["args"]["_caller"] === userAddress &&
        x["args"]["_receiver"] !== zeroAddress
    )
    .map((x: any) => x["args"]["_shares"])
    .reduce(
      (accumulator: any, currentValue: any) => accumulator - currentValue,
      netDeposited
    )

  netDeposited = transferLogs.data
    ?.filter(
      (x: any) =>
        x["args"]["_caller"] !== zeroAddress &&
        x["args"]["_receiver"] === userAddress
    )
    .map((x: any) => x["args"]["_shares"])
    .reduce(
      (accumulator: any, currentValue: any) => accumulator + currentValue,
      netDeposited
    )

  const { data: primaryAssetPriceUsd, isLoading: isLoadingPricer } =
    useTokenPriceUsd({ asset, enabled: isConnected && enabled })

  const earned = !primaryAssetShare.data
    ? 0n
    : primaryAssetShare.data - netDeposited

  return {
    isLoading: isLoadingPricer,
    data: {
      earned: !isConnected ? 0 : earned,
      earnedUSD: !isConnected
        ? 0
        : Number(primaryAssetPriceUsd ?? 0) * (Number(earned ?? "0") / 1e18),
    },
  }
}

function useTokenVaultUserEarningsFallback() {
  const { isConnected } = useAccount()

  // const { data: primaryAssetPriceUsd, isLoading: isLoadingPricer } =
  //   useTokenPriceUsd({ asset, enabled: isConnected && enabled })
  // const { data: totalAssets, isLoading: isLoadingTotalAssets } =
  //   useVaultTotalAssets({ vaultAddress, enabled: isConnected && enabled })
  return {
    isLoading: false, //isLoadingPricer,
    data: {
      earned: !isConnected ? 0 : 1,
      earnedUSD: !isConnected ? 0 : 1,
    },
  }
}

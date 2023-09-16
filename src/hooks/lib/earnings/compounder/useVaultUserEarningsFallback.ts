/* eslint-disable @typescript-eslint/no-explicit-any */
import { zeroAddress } from "viem"
import { useAccount, useContractRead } from "wagmi"

import { VaultProps } from "@/lib/types"
import {
  useActiveChainId,
  useArbitrumDepositLogs,
  useArbitrumTransferLogs,
  useArbitrumWithdrawLogs,
  useIsTokenVault,
  useTokenVaultSymbol,
} from "@/hooks"
import { useVaultContract } from "@/hooks/lib/useVaultContract"
import { useTokenPriceUsd } from "@/hooks/useTokenPriceUsd"

import { AMMCompounderBase } from "@/constant/abi"

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

function useTokenVaultUserEarningsFallback({
  asset,
  vaultAddress,
  enabled,
}: Pick<VaultProps, "asset" | "vaultAddress"> & {
  enabled?: boolean
}) {
  const { isConnected, address: userAddress } = useAccount()
  const tokenVaultSymbol = useTokenVaultSymbol({
    asset,
    enabled,
  })

  const ybTokenSymbol = tokenVaultSymbol.data
  const chainId = useActiveChainId()

  const balanceOf = useContractRead({
    chainId,
    abi: AMMCompounderBase,
    address: vaultAddress,
    enabled: ybTokenSymbol === "fcGLP" && enabled,
    functionName: "balanceOf",
    args: [userAddress ?? "0x"],
  })

  const primaryAssetShare = useContractRead({
    chainId,
    abi: AMMCompounderBase,
    address: vaultAddress,
    enabled: ybTokenSymbol === "fcGLP" && balanceOf.isSuccess && enabled,
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

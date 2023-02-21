import { useContractReads } from "wagmi"

import {
  findApiCompounderVaultForAsset,
  findApiTokenVaultForAsset,
} from "@/lib/findApiVaultForAsset"
import { VaultProps } from "@/lib/types"
import { useApiCompounderVaults, useApiTokenVaults } from "@/hooks/api"
import useActiveChainId from "@/hooks/useActiveChainId"
import { useIsTokenCompounder } from "@/hooks/useVaultTypes"

import { vaultCompounderAbi } from "@/constant/abi"

export function useCompounderFees({ asset, type }: VaultProps) {
  const chainId = useActiveChainId()
  const isToken = useIsTokenCompounder(type)

  // Preferred: API request
  const apiCompounderQuery = useApiCompounderVaults({ type })
  const apiTokenQuery = useApiTokenVaults({ type })
  // Fallback: contract request
  const fees = useContractReads({
    contracts: [
      {
        chainId,
        abi: vaultCompounderAbi,
        address: asset,
        functionName: "platformFeePercentage",
      },
      {
        chainId,
        abi: vaultCompounderAbi,
        address: asset,
        functionName: "withdrawFeePercentage",
      },
    ],
    enabled: asset && (apiCompounderQuery.isError || apiTokenQuery.isError),
    select: (feeVaules) => feeVaules.map((fee) => fee.toString()),
  })

  // Prioritize API response until it has errored
  if (!apiCompounderQuery.isError && !isToken) {
    const matchedCompounder = findApiCompounderVaultForAsset(
      apiCompounderQuery.data,
      asset
    )
    return {
      ...apiCompounderQuery,
      data: {
        platformFee: matchedCompounder?.platformFee
          ? String(matchedCompounder.platformFee)
          : undefined,
        withdrawFee: matchedCompounder?.withdrawalFee
          ? String(matchedCompounder.withdrawalFee)
          : undefined,
      },
    }
  }
  if (!apiTokenQuery.isError && isToken) {
    const matchedCompounder = findApiTokenVaultForAsset(
      apiTokenQuery.data,
      asset
    )
    return {
      ...apiTokenQuery,
      data: {
        platformFee: matchedCompounder?.platformFee
          ? String(matchedCompounder.platformFee)
          : undefined,
        withdrawFee: matchedCompounder?.withdrawalFee
          ? String(matchedCompounder.withdrawalFee)
          : undefined,
      },
    }
  }

  // Fallback to contract data after failure
  return {
    ...fees,
    data: {
      platformFee: fees.data?.[0],
      withdrawFee: fees.data?.[1],
    },
  }
}

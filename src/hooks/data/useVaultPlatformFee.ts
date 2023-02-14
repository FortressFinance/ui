import { useContractRead } from "wagmi"

import { VaultProps } from "@/lib/types"
import { useApiCompounderVaults, useApiTokenVaults } from "@/hooks/api"
import useVaultTokens from "@/hooks/data/useVaultTokens"
import useActiveChainId from "@/hooks/useActiveChainId"
import { useIsTokenCompounder } from "@/hooks/useVaultTypes"

import { vaultCompounderAbi } from "@/constant/abi"

export default function useVaultPlatformFee({ asset, type }: VaultProps) {
  const chainId = useActiveChainId()
  const isToken = useIsTokenCompounder(type)
  const { data: vaultTokens } = useVaultTokens({
    asset,
    type,
  })
  // Preferred: API request
  const apiCompounderQuery = useApiCompounderVaults({ type })
  const apiTokenQuery = useApiTokenVaults({ type })
  // Fallback: contract request
  const registryQuery = useContractRead({
    chainId,
    abi: vaultCompounderAbi,
    address: asset,
    functionName: "platformFeePercentage",
    enabled: apiCompounderQuery.isError || apiTokenQuery.isError,
    select: (data) => data.toString(),
  })
  // Prioritize API response until it has errored
  if (!apiCompounderQuery.isError && !isToken) {
    return {
      ...apiCompounderQuery,
      data: apiCompounderQuery.data?.find(
        (p) => p.token.ybToken.address === vaultTokens.ybTokenAddress
      )?.platformFee,
    }
  }
  if (!apiTokenQuery.isError && isToken) {
    return {
      ...apiTokenQuery,
      data: apiTokenQuery.data?.find(
        (p) => p.token.ybToken.address === vaultTokens.ybTokenAddress
      )?.platformFee,
    }
  }
  // Fallback to contract data after failure
  return registryQuery
}

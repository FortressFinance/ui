import { zeroAddress } from "viem"
import { Address, useContractRead } from "wagmi"

import { useApiConcentratorTargetAssets } from "@/hooks/lib/api/useApiConcentratorTargetAssets"
import { useRegistryContract } from "@/hooks/lib/useRegistryContract"

///
/// Returns the concentrator lists
///
export function useConcentratorTargetAssets(
  options: {
    onSuccess?: (data: Address[]) => void
  } = {}
) {
  const apiQuery = useApiConcentratorTargetAssets(options)
  const targetAssets = useContractRead({
    ...useRegistryContract(),
    functionName: "concentratorTargetAssets",
    select: (data) =>
      Array.from(new Set(data.filter((x) => x !== zeroAddress))),
    onSuccess: options.onSuccess,
    enabled: apiQuery.isError,
  })
  return apiQuery.isError
    ? { ...targetAssets, data: targetAssets.data }
    : apiQuery
}

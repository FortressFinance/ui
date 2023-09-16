import { zeroAddress } from "viem"
import { Address, useContractRead } from "wagmi"

import { useRegistryContract } from "@/hooks/lib/useRegistryContract"

///
/// Returns the concentrator lists
///
export function useConcentratorTargetAssets(
  options: {
    onSuccess?: (data: Address[]) => void
    enabled?: boolean
  } = {}
) {
  return useContractRead({
    ...useRegistryContract(),
    functionName: "concentratorTargetAssets",
    select: (data) =>
      Array.from(new Set(data.filter((x) => x !== zeroAddress))),
    onSuccess: options.onSuccess,
    enabled: options.enabled,
  })
}

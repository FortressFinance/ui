import { Address, useContractRead } from "wagmi"

import { useRegistryContract } from "@/hooks/lib/useRegistryContract"

export function useTokenVaultSymbol({
  asset,
  enabled,
}: {
  asset: Address
  enabled: boolean
}) {
  const registryQuery = useContractRead({
    ...useRegistryContract(),
    functionName: "getTokenCompounderSymbol",
    args: [asset],
    enabled: enabled,
  })

  return registryQuery
}

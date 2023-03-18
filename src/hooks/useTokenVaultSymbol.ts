import { useContractRead } from "wagmi"

import { VaultDynamicProps } from "@/lib/types"
import { useRegistryContract } from "@/hooks/lib/useRegistryContract"

export function useTokenVaultSymbol({
  asset,
  enabled,
}: {
  asset: VaultDynamicProps["asset"]
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
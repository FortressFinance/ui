import { useContractRead } from "wagmi"

import { VaultDynamicProps } from "@/hooks/types"
import useRegistryContract from "@/hooks/useRegistryContract"

export default function useTokenVaultSymbol({
  asset,
  enabled,
}: {
  asset: VaultDynamicProps["asset"]
  enabled: boolean
}) {
  const registryQuery = useContractRead({
    ...useRegistryContract(),
    functionName: "getTokenCompounderSymbol",
    args: [asset ?? "0x"],
    enabled: enabled,
  })

  return registryQuery
}

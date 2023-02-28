import { useContractRead } from "wagmi"

import { VaultDynamicProps } from "@/lib/types"
import { useRegistryContract } from "@/hooks/contracts"

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

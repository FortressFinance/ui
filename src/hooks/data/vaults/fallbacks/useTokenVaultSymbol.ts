import { useContractRead } from "wagmi"

import { VaultDynamicProps } from "@/lib/types"
import { useYieldCompoundersRegistryContract } from "@/hooks/contracts/useYieldCompoundersRegistry"

export default function useTokenVaultSymbol({
  asset,
  enabled,
}: {
  asset: VaultDynamicProps["asset"]
  enabled: boolean
}) {
  const registryQuery = useContractRead({
    ...useYieldCompoundersRegistryContract(),
    functionName: "getTokenCompounderSymbol",
    args: [asset ?? "0x"],
    enabled: enabled,
  })

  return registryQuery
}

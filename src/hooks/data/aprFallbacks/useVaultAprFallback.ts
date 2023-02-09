import { useQuery } from "@tanstack/react-query"
import { Address } from "wagmi"

import { getVaultAprFallback } from "@/lib/api/vaults"
import { queryKeys } from "@/lib/helpers"

export function useVaultAprFallback({
  asset,
  enabled,
}: {
  asset: Address | undefined
  enabled: boolean
}) {
  return useQuery({
    ...queryKeys.vaults.apr({ asset }),
    queryFn: async () => await getVaultAprFallback(asset),
    retry: false,
    enabled,
  })
}

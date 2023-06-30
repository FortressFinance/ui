import { useQuery } from "@tanstack/react-query"
import { Address } from "wagmi"

import { getAuraMint, getFortAuraBalAprFallback } from "@/lib/api/vaults"
import { useActiveChainId } from "@/hooks"

export default function useTokenAuraBalVault({
  asset,
  enabled,
}: {
  asset: Address
  enabled: boolean
}) {
  const chainId = useActiveChainId()
  const auraTokenQuery = useQuery([chainId, asset, "auraMint"], {
    queryFn: () => getAuraMint(),
    retry: false,
    enabled,
    keepPreviousData: enabled,
    refetchInterval: enabled ? 20000 : false,
    refetchIntervalInBackground: false,
  })

  const auraTokenMint = auraTokenQuery.data

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fortAuraBalAprFallback = useQuery(
    [chainId, asset, "fortAuraBalAprFallback"],
    {
      queryFn: () => getFortAuraBalAprFallback(auraTokenMint),
      retry: false,
      enabled: enabled && auraTokenQuery.isSuccess,
      keepPreviousData: enabled,
      refetchInterval: enabled ? 20000 : false,
      refetchIntervalInBackground: false,
    }
  )

  return fortAuraBalAprFallback
}

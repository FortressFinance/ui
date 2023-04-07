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
    enabled: enabled,
  })

  const auraTokenMint = auraTokenQuery.data

  const fortAuraBalAprFallback = useQuery([asset, "fortAuraBalAprFallback"], {
    queryFn: () => getFortAuraBalAprFallback(auraTokenMint),
    retry: false,
    enabled: enabled && !!auraTokenMint,
  })

  return fortAuraBalAprFallback
}

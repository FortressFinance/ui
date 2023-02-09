import { useQuery } from "wagmi"

import { getAuraMint, getFortAuraBalAprFallback } from "@/lib/api/vaults"
import { VaultDynamicProps } from "@/lib/types"
import useActiveChainId from "@/hooks/useActiveChainId"

export default function useTokenAuraBalVault({
  asset,
  enabled,
}: {
  asset: VaultDynamicProps["asset"]
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

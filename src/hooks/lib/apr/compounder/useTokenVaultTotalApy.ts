import { Address } from "wagmi"

import { convertToApy } from "@/lib/api/vaults/convertToApy"
import { useActiveChainId } from "@/hooks"
import useTokenVaultArbitrumTotalApr from "@/hooks/lib/apr/compounder/useTokenVaultArbitrumTotalApr"
import useTokenVaultMainnetTotalApr from "@/hooks/lib/apr/compounder/useTokenVaultMainnetTotalApr"

export default function useTokenVaultTotalApy({
  asset,
  enabled,
}: {
  asset: Address
  enabled: boolean
}) {
  const chainId = useActiveChainId()
  const isArbitrumFamily = chainId === 313371 || chainId === 42161
  const tokenVaultMainnetTotalApr = useTokenVaultMainnetTotalApr({
    asset,
    enabled: enabled && !isArbitrumFamily,
  })

  const tokenVaultArbitrumTotalApr = useTokenVaultArbitrumTotalApr({
    asset,
    enabled: enabled && isArbitrumFamily,
  })

  if (!isArbitrumFamily) {
    return {
      ...tokenVaultMainnetTotalApr,
      data: convertToApy(tokenVaultMainnetTotalApr.data),
    }
  }
  return {
    ...tokenVaultArbitrumTotalApr,
    data: convertToApy(tokenVaultArbitrumTotalApr.data),
  }
}

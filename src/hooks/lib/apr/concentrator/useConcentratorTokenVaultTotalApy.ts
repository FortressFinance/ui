import { Address } from "wagmi"

import { convertToApy } from "@/lib/api/vaults/convertToApy"
import { useActiveChainId } from "@/hooks"
import useConcentratorTokenVaultArbitrumTotalApr from "@/hooks/lib/apr/concentrator/useConcentratorTokenVaultArbitrumTotalApr"
import useConcentratorTokenVaultMainnetTotalApr from "@/hooks/lib/apr/concentrator/useConcentratorTokenVaultMainnetTotalApr"

export default function useConcentratorTokenVaultTotalApy({
  asset,
  enabled,
}: {
  asset: Address
  enabled: boolean
}) {
  const chainId = useActiveChainId()
  const isArbitrumFamily = chainId === 313371 || chainId === 42161
  const tokenVaultMainnetTotalApr = useConcentratorTokenVaultMainnetTotalApr({
    asset,
    enabled: enabled && !isArbitrumFamily,
  })

  const tokenVaultArbitrumTotalApr = useConcentratorTokenVaultArbitrumTotalApr({
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

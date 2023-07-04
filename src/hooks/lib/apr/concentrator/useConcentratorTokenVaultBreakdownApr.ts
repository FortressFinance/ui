import { Address } from "wagmi"

import { useActiveChainId } from "@/hooks"
import { useConcentratorTokenVaultArbitrumBreakdownApr } from "@/hooks/lib/apr/concentrator/useConcentratorTokenVaultArbitrumTotalApr"
import { useConcentratorTokenVaultMainnetBreakdownApr } from "@/hooks/lib/apr/concentrator/useConcentratorTokenVaultMainnetTotalApr"

export default function useConcentratorTokenVaultBreakdownApr({
  asset,
  enabled,
}: {
  asset: Address
  enabled: boolean
}) {
  const chainId = useActiveChainId()
  const isArbitrumFamily =
    chainId === 313371 || chainId === 42161 || chainId === 1337
  const tokenVaultMainnetBreakdownApr =
    useConcentratorTokenVaultMainnetBreakdownApr({
      asset,
      enabled: enabled && !isArbitrumFamily,
    })

  const tokenVaultArbitrumBreakdownApr =
    useConcentratorTokenVaultArbitrumBreakdownApr({
      asset,
      enabled: enabled && isArbitrumFamily,
    })

  if (!isArbitrumFamily) {
    return tokenVaultMainnetBreakdownApr
  }
  return tokenVaultArbitrumBreakdownApr
}

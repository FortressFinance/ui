import { Address } from "wagmi"

import { convertToApy } from "@/lib/api/vaults/convertToApy"
import { useActiveChainId } from "@/hooks"
import { useConcentratorTokenVaultArbitrumBreakdownApr } from "@/hooks/lib/apr/concentrator/useConcentratorTokenVaultArbitrumTotalApr"
import { useConcentratorTokenVaultMainnetBreakdownApr } from "@/hooks/lib/apr/concentrator/useConcentratorTokenVaultMainnetTotalApr"

export default function useConcentratorTokenVaultTotalApy({
  asset,
  enabled,
}: {
  asset: Address
  enabled: boolean
}) {
  const apr = useConcentratorTokenVaultTotalApr({
    asset,
    enabled,
  })
  return {
    ...apr,
    data: convertToApy(apr.data),
  }
}

export function useConcentratorTokenVaultTotalApr({
  asset,
  enabled,
}: {
  asset: Address
  enabled: boolean
}) {
  const tokenVaultBreakdownApr = useConcentratorTokenVaultBreakdownApr({
    asset,
    enabled,
  })
  return {
    ...tokenVaultBreakdownApr,
    data: tokenVaultBreakdownApr.data?.totalApr,
  }
}

export function useConcentratorTokenVaultBreakdownApr({
  asset,
  enabled,
}: {
  asset: Address
  enabled: boolean
}) {
  const chainId = useActiveChainId()
  const isArbitrumFamily = chainId === 313371 || chainId === 42161
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

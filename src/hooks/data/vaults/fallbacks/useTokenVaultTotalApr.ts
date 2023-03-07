import { VaultDynamicProps } from "@/lib/types"
import useTokenVaultArbitrumTotalApr from "@/hooks/data/vaults/fallbacks/useTokenVaultArbitrumTotalApr"
import useTokenVaultMainnetTotalApr from "@/hooks/data/vaults/fallbacks/useTokenVaultMainnetTotalApr"
import useActiveChainId from "@/hooks/useActiveChainId"

export default function useTokenVaultTotalApr({
  asset,
  enabled,
}: {
  asset: VaultDynamicProps["asset"]
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

  const compoundPeriod = 84_600 // 1 day
  const yearInSecond = 31_556_926
  const n = yearInSecond / compoundPeriod

  if (!isArbitrumFamily) {
    const totalApr = tokenVaultMainnetTotalApr.data ?? 0
    const apy = (1 + totalApr / n) ** n - 1
    return {
      ...tokenVaultMainnetTotalApr,
      data: apy,
    }
  }
  return tokenVaultArbitrumTotalApr
}
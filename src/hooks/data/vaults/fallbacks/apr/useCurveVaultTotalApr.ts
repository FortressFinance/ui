import { VaultDynamicProps } from "@/lib/types"
import useCurveVaultArbitrumTotalApr from "@/hooks/data/vaults/fallbacks/apr/useCurveVaultArbitrumTotalApr"
import useCurveVaultMainnetTotalApr from "@/hooks/data/vaults/fallbacks/apr/useCurveVaultMainnetTotalApr"
import useActiveChainId from "@/hooks/useActiveChainId"

export default function useCurveVaultTotalApr({
  asset,
  enabled,
}: {
  asset: VaultDynamicProps["asset"]
  enabled: boolean
}) {
  const chainId = useActiveChainId()
  const isArbitrumFamily = chainId === 313371 || chainId === 42161
  const curveVaultMainnetTotalApr = useCurveVaultMainnetTotalApr({
    asset,
    enabled: enabled && !isArbitrumFamily,
  })

  const curveVaultArbitrumTotalApr = useCurveVaultArbitrumTotalApr({
    asset,
    enabled: enabled && isArbitrumFamily,
  })

  const compoundPeriod = 84_600 // 1 day
  const yearInSecond = 31_556_926
  const n = yearInSecond / compoundPeriod

  if (!isArbitrumFamily) {
    const totalApr = curveVaultMainnetTotalApr.data ?? 0
    const apy = (1 + totalApr / n) ** n - 1
    return {
      ...curveVaultMainnetTotalApr,
      data: apy,
    }
  }
  return curveVaultArbitrumTotalApr
}

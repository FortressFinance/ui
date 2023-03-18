import { VaultDynamicProps } from "@/lib/types"
import useCurveVaultArbitrumTotalApr from "@/hooks/lib/apr/useCurveVaultArbitrumTotalApr"
import useCurveVaultMainnetTotalApr from "@/hooks/lib/apr/useCurveVaultMainnetTotalApr"
import { useActiveChainId } from "@/hooks"

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

  const compoundPeriod = 84_600 * 7 // 7 days - 1 week
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

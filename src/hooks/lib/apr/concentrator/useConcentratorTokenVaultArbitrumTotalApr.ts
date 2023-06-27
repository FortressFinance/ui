import { Address } from "wagmi"

import useTokenGlpVault from "@/hooks/lib/apr/useTokenGlpVault"
import { useTokenOrNative } from "@/hooks/useTokenOrNative"

export default function useConcentratorTokenVaultArbitrumTotalApr({
  asset,
  enabled,
}: {
  asset: Address
  enabled: boolean
}) {
  const tokenVaultBreakdownApr = useConcentratorTokenVaultArbitrumBreakdownApr({
    asset,
    enabled,
  })

  return {
    ...tokenVaultBreakdownApr,
    data: tokenVaultBreakdownApr.data?.totalApr,
  }
}

export function useConcentratorTokenVaultArbitrumBreakdownApr({
  asset,
  enabled,
}: {
  asset: Address
  enabled: boolean
}) {
  const { data: token } = useTokenOrNative({
    address: asset,
  })

  const targetAssetSymbol = token?.symbol

  const isGlpTokenFallbackEnabled =
    enabled && !!targetAssetSymbol && targetAssetSymbol === "fcGLP"

  return useTokenGlpVault({
    enabled: isGlpTokenFallbackEnabled ?? false,
  })
}

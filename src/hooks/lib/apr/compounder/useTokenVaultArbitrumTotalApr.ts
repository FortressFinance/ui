import { Address } from "wagmi"

import useTokenGlpVault from "@/hooks/lib/apr/useTokenGlpVault"
import { useTokenVaultSymbol } from "@/hooks/useTokenVaultSymbol"

export default function useTokenVaultArbitrumTotalApr({
  asset,
  enabled,
}: {
  asset: Address
  enabled: boolean
}) {
  const tokenVaultSymbol = useTokenVaultSymbol({ asset, enabled })

  const ybTokenSymbol = tokenVaultSymbol.data

  const isGlpTokenFallbackEnabled =
    enabled && !!ybTokenSymbol && ybTokenSymbol === "fcGLP"
  const tokenGlpVault = useTokenGlpVault({
    enabled: isGlpTokenFallbackEnabled ?? false,
  })

  return {
    ...tokenGlpVault,
    data: tokenGlpVault.totalApr,
  }
}

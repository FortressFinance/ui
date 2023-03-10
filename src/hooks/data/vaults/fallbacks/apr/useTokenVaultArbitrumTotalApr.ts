import { VaultDynamicProps } from "@/lib/types"
import useTokenGlpVault from "@/hooks/data/vaults/fallbacks/apr/useTokenGlpVault"
import useTokenVaultSymbol from "@/hooks/data/vaults/fallbacks/useTokenVaultSymbol"

export default function useTokenVaultArbitrumTotalApr({
  asset,
  enabled,
}: {
  asset: VaultDynamicProps["asset"]
  enabled: boolean
}) {
  const tokenVaultSymbol = useTokenVaultSymbol({ asset, enabled })

  const ybTokenSymbol = tokenVaultSymbol.data

  const isGlpTokenFallbackEnabled =
    enabled && !!ybTokenSymbol && ybTokenSymbol === "fcGLP"
  const tokenGlpVault = useTokenGlpVault({
    asset,
    enabled: isGlpTokenFallbackEnabled ?? false,
  })

  return {
    ...tokenGlpVault,
    data: tokenGlpVault.data?.totalApr,
  }
}

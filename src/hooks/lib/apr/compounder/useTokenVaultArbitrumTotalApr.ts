import { VaultDynamicProps } from "@/lib/types"
import useTokenGlpVault from "@/hooks/lib/apr/compounder/useTokenGlpVault"
import { useTokenVaultSymbol } from "@/hooks/useTokenVaultSymbol"

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

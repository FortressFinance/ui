import { VaultDynamicProps } from "@/lib/types"
import useTokenAuraBalVault from "@/hooks/data/vaults/fallbacks/useTokenAuraBalVault"
import useTokenCvxCrvVault from "@/hooks/data/vaults/fallbacks/useTokenCvxCrvVault"
import useTokenGlpVault from "@/hooks/data/vaults/fallbacks/useTokenGlpVault"
import useTokenVaultSymbol from "@/hooks/data/vaults/fallbacks/useTokenVaultSymbol"

export default function useTokenVaultGraphTotalApr({
  asset,
  enabled,
}: {
  asset: VaultDynamicProps["asset"]
  enabled: boolean
}) {
  const tokenVaultSymbol = useTokenVaultSymbol({ asset, enabled })

  const ybTokenSymbol = tokenVaultSymbol.data

  const isAuraTokenFallbackEnabled =
    enabled && !!ybTokenSymbol && ybTokenSymbol === "fort-auraBAL"
  const tokenAuraBalVault = useTokenAuraBalVault({
    asset,
    enabled: isAuraTokenFallbackEnabled ?? false,
  })

  const isCvxCrvTokenFallbackEnabled =
    enabled && !!ybTokenSymbol && ybTokenSymbol === "fort-cvxCRV"
  const tokenCvxCrvVault = useTokenCvxCrvVault({
    asset,
    enabled: isCvxCrvTokenFallbackEnabled ?? false,
  })

  const isGlpTokenFallbackEnabled =
    enabled && !!ybTokenSymbol && ybTokenSymbol === "fortGLP"
  const tokenGlpVault = useTokenGlpVault({
    asset,
    enabled: isGlpTokenFallbackEnabled ?? false,
  })

  if (!tokenAuraBalVault.isError && !!tokenAuraBalVault.data) {
    return {
      ...tokenAuraBalVault,
      data: tokenAuraBalVault.data.totalApr,
    }
  }

  if (!tokenCvxCrvVault.isError && !!tokenCvxCrvVault.data) {
    return {
      ...tokenCvxCrvVault,
      data: tokenCvxCrvVault.data.totalApr,
    }
  }

  return {
    ...tokenGlpVault,
    data: tokenGlpVault.data?.totalApr,
  }
}

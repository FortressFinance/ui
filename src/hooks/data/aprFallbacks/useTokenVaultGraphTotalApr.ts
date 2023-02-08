import useTokenAuraBalVault from "@/hooks/data/aprFallbacks/useTokenAuraBalVault"
import useTokenCvxCrvVault from "@/hooks/data/aprFallbacks/useTokenCvxCrvVault"
import useTokenGlpVault from "@/hooks/data/aprFallbacks/useTokenGlpVault"
import useTokenVaultSymbol from "@/hooks/data/aprFallbacks/useTokenVaultSymbol"
import { VaultDynamicProps } from "@/hooks/types"

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

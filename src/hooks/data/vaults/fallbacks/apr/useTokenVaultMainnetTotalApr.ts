import { VaultDynamicProps } from "@/lib/types"
import useTokenAuraBalVault from "@/hooks/data/vaults/fallbacks/apr/useTokenAuraBalVault"
import useTokenCvxCrvVault from "@/hooks/data/vaults/fallbacks/apr/useTokenCvxCrvVault"
import useTokenVaultSymbol from "@/hooks/data/vaults/fallbacks/useTokenVaultSymbol"

export default function useTokenVaultMainnetTotalApr({
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

  if (!tokenAuraBalVault.isError && !!tokenAuraBalVault.data) {
    return {
      ...tokenAuraBalVault,
      data: tokenAuraBalVault.data.totalApr,
    }
  }

  return {
    ...tokenCvxCrvVault,
    data: tokenCvxCrvVault?.data?.totalApr,
  }
}

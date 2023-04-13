import { Address } from "wagmi"

import useTokenAuraBalVault from "@/hooks/lib/apr/useTokenAuraBalVault"
import useTokenCvxCrvVault from "@/hooks/lib/apr/useTokenCvxCrvVault"
import { useTokenVaultSymbol } from "@/hooks/useTokenVaultSymbol"

export default function useTokenVaultMainnetTotalApr({
  asset,
  enabled,
}: {
  asset: Address
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

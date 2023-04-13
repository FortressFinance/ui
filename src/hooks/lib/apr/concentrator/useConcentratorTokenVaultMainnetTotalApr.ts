import { Address } from "wagmi"

import useTokenAuraBalVault from "@/hooks/lib/apr/useTokenAuraBalVault"
import useTokenCvxCrvVault from "@/hooks/lib/apr/useTokenCvxCrvVault"
import { useTokenOrNative } from "@/hooks/useTokenOrNative"

export default function useConcentratorTokenVaultMainnetTotalApr({
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

  const isAuraTokenFallbackEnabled =
    enabled && !!targetAssetSymbol && targetAssetSymbol === "fort-auraBAL"
  const tokenAuraBalVault = useTokenAuraBalVault({
    asset,
    enabled: isAuraTokenFallbackEnabled ?? false,
  })

  const isCvxCrvTokenFallbackEnabled =
    enabled && !!targetAssetSymbol && targetAssetSymbol === "fort-cvxCRV"
  const tokenCvxCrvVault = useTokenCvxCrvVault({
    asset,
    enabled: isCvxCrvTokenFallbackEnabled ?? false,
  })

  if (asset === "0x") {
    return {
      isLoading: false,
      data: 0,
    }
  }

  if (!tokenAuraBalVault.isError) {
    return {
      ...tokenAuraBalVault,
      data: tokenAuraBalVault?.data?.totalApr,
    }
  }

  return {
    ...tokenCvxCrvVault,
    data: tokenCvxCrvVault?.data?.totalApr,
  }
}

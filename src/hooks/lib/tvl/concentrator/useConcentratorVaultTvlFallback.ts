import { Address } from "wagmi"

import { VaultType } from "@/lib/types"
import { useConcentratorVault, useTokenPriceUsd } from "@/hooks"
import useVaultTotalAssets from "@/hooks/lib/tvl/compounder/useVaultTotalAssets"

type ConcentratorVaultTvlFallbackProps = {
  targetAsset: Address
  primaryAsset: Address
  type: VaultType
  enabled?: boolean
}

export default function useConcentratorVaultTvlFallback({
  targetAsset,
  primaryAsset,
  type,
  enabled,
}: ConcentratorVaultTvlFallbackProps) {
  const concentrator = useConcentratorVault({
    targetAsset,
    primaryAsset,
    type,
    enabled,
  })

  const { data: primaryAssetPriceUsd, isLoading: isLoadingPricer } =
    useTokenPriceUsd({ asset: primaryAsset, enabled: true })
  const { data: totalAssets, isLoading: isLoadingTotalAssets } =
    useVaultTotalAssets({
      vaultAddress: !concentrator?.data
        ? "0x"
        : concentrator?.data.ybTokenAddress,
      enabled: true,
    })
  return {
    isLoading:
      isLoadingPricer || isLoadingTotalAssets || concentrator.isLoading,
    data: {
      usdTvl:
        Number(primaryAssetPriceUsd ?? 0) *
        (Number(totalAssets?.toString() ?? "0") / 1e18),
      tvl: totalAssets?.toString() ?? "0",
    },
  }
}

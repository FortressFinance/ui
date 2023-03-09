

import { VaultDynamicProps } from "@/lib/types"
import usePricer from "@/hooks/data/vaults/fallbacks/pricer/usePricer"
import useCurveVaultTotalAssets from "@/hooks/data/vaults/fallbacks/tvl/useCurveVaultTotalAssets"

export default function useCurveVaultTotalApr({
  asset,
  vaultAddress,
  enabled,
}: {
  asset: VaultDynamicProps["asset"]
  vaultAddress: VaultDynamicProps["vaultAddress"]
  enabled: boolean
}) {
  const { data: primaryAssetPriceUsd, isLoading: isLoadingPricer } = usePricer({primaryAsset: asset, enabled})
  const { data: totalAssets, isLoading: isLoadingTotalAssets } = useCurveVaultTotalAssets({ vaultAddress, enabled})
  console.log(">>>>>>>>", totalAssets?.toString(), vaultAddress, asset)
  return {
    isLoading: isLoadingPricer || isLoadingTotalAssets,
    data: Number(primaryAssetPriceUsd ?? 0) * (Number(totalAssets === undefined? "0" : totalAssets.toString()) / 1e18)
  }
}
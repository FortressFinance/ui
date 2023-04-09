import { BigNumber } from "ethers"
import { Address } from "wagmi"

import useConcentratorAsset from "@/hooks/lib/tvl/concentrator/useConcentratorAsset"
import { useConcentratorTokenPriceUsd } from "@/hooks/useConcentratorTokenPriceUsd"
import { useTokenOrNativeBalance } from "@/hooks/useTokenOrNativeBalance"

export default function useConcentratorAumFallback({
  asset,
  ybToken,
  enabled,
}: {
  asset: Address
  ybToken: Address
  enabled: boolean
}) {
  const { data: primaryAssetPriceUsd, isLoading: isLoadingPricer } =
    useConcentratorTokenPriceUsd({ asset, enabled })

  const { data: userShare, isLoading: isLoadingUserShare } =
    useTokenOrNativeBalance({ address: ybToken })
  const { data: userAsset, isLoading: isLoadingUserAsset } =
    useConcentratorAsset({
      ybToken,
      share: userShare?.value ?? BigNumber.from(0),
      enabled,
    })

  return {
    isLoading: isLoadingPricer || isLoadingUserShare || isLoadingUserAsset,
    data:
      Number(primaryAssetPriceUsd ?? 0) *
      (Number(userAsset === undefined ? "0" : userAsset.toString()) / 1e18),
  }
}

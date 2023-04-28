import { useMemo } from "react"
import { Address } from "wagmi"

import { VaultType } from "@/lib/types"
import { useFallbackToUseByAsset as useGetFallbackToUseByAsset } from "@/hooks/useGetFallbackToUseByAsset"

export function useIsCurveVault(type: VaultType) {
  return useMemo(() => type === "curve", [type])
}

export function useIsTokenVault(type: VaultType) {
  return useMemo(() => type === "token", [type])
}

export function useShouldUseCurveFallback(asset: Address) {
  const fallbackToUse = useGetFallbackToUseByAsset()
  return useMemo(() => fallbackToUse[asset] === "curve", [asset, fallbackToUse])
}

export function useShouldUseTokenFallback(asset: Address) {
  const fallbackToUse = useGetFallbackToUseByAsset()
  return useMemo(() => fallbackToUse[asset] === "token", [asset, fallbackToUse])
}

import { useMemo } from "react"
import { Address } from "wagmi"

import { VaultType } from "@/lib/types"
import { useActiveChainConfig } from "@/hooks/useActiveChainConfig"

export function useIsCurveVault(type: VaultType) {
  return useMemo(() => type === "curve", [type])
}

export function useIsTokenVault(type: VaultType) {
  return useMemo(() => type === "token", [type])
}

export function useShouldUseCurveFallback(asset: Address) {
  const fallbackToUse = useActiveChainConfig().fallbackType
  return useMemo(() => fallbackToUse[asset] === "curve", [asset, fallbackToUse])
}

export function useShouldUseTokenFallback(asset: Address) {
  const fallbackToUse = useActiveChainConfig().fallbackType
  return useMemo(() => fallbackToUse[asset] === "token", [asset, fallbackToUse])
}

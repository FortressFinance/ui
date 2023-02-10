import { useMemo } from "react"

import { VaultType } from "@/lib/types"

export function useIsBalancerCompounder(type: VaultType) {
  return useMemo(() => type === "balancer", [type])
}

export function useIsCurveCompounder(type: VaultType) {
  return useMemo(() => type === "curve", [type])
}

export function useIsTokenCompounder(type: VaultType) {
  return useMemo(() => type === "token", [type])
}

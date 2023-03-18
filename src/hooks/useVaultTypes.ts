import { useMemo } from "react"

import { VaultType } from "@/lib/types"

export function useIsCurveCompounder(type: VaultType) {
  return useMemo(() => type === "curve", [type])
}

export function useIsTokenCompounder(type: VaultType) {
  return useMemo(() => type === "token", [type])
}

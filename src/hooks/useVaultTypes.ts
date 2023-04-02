import { useMemo } from "react"

import { VaultType } from "@/lib/types"

export function useIsCurveVault(type: VaultType) {
  return useMemo(() => type === "curve", [type])
}

export function useIsTokenVault(type: VaultType) {
  return useMemo(() => type === "token", [type])
}

import { useMemo } from "react"

import { VaultType } from "@/hooks/types"

export default function useIsCurve(type: VaultType) {
  return useMemo(() => type === "curve", [type])
}

import { useMemo } from "react"

import { VaultType } from "@/hooks/types"

export default function useIsCurve(type: VaultType) {
  return useMemo(
    () =>
      ["CRYPTO", "FEATURED", "STABLE"].includes(type?.toLocaleUpperCase())
        ? false
        : type === "curve",
    [type]
  )
}

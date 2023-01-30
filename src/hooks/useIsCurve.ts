import { useMemo } from "react"

import { VaultType } from "@/hooks/types"

export default function useIsCurve(type: VaultType) {
  return useMemo(
    () => (["CRYPTO","FEATURED","STABLE"].includes(type?.toLocaleUpperCase()) ? undefined : type === "curve"),
    [type]
  )
}

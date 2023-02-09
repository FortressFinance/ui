import { useMemo } from "react"

import { VaultType } from "@/lib/types"

export default function useIsTokenCompounder(type: VaultType) {
  return useMemo(
    () => ["CRYPTO", "FEATURED", "STABLE"].includes(type?.toLocaleUpperCase()),
    [type]
  )
}

import { useMemo } from "react"

import { ProductType } from "@/lib/types"

export function useIsCompounderProduct(type: ProductType) {
  return useMemo(() => type === "compounder", [type])
}

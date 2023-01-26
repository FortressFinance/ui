import { useEffect, useRef } from "react"

import useApiCompounderPools from "@/hooks/api/useApiCompounderPools"
import { VaultProps } from "@/hooks/types"
import useIsCurve from "@/hooks/useIsCurve"

export default function useCompounderPoolId({ address, type }: VaultProps) {
  const fieldKey = useRef("")
  const isCurve = useIsCurve(type)

  useEffect(() => {
    fieldKey.current = isCurve !== undefined ? "poolId" : "vaultId"
  }, [isCurve])

  const apiQuery = useApiCompounderPools({ type })
  return {
    ...apiQuery,
    data: apiQuery.data?.find((p) => p.token.ybToken.address === address)?.[
      fieldKey.current
    ],
  }
}

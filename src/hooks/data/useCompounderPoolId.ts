import { useQuery } from "wagmi"

import {
  fetchApiCurveCompounderPools,
  fetchApiTokenCompounderPools,
} from "@/hooks/api/useApiCompounderPools"
import { VaultProps } from "@/hooks/types"
import useIsCurve from "@/hooks/useIsCurve"
import useIsTokenCompounder from "@/hooks/useIsTokenCompounder"

export default function useCompounderPoolId({ address, type }: VaultProps) {
  const isCurve = useIsCurve(type)
  const isToken = useIsTokenCompounder(type)
  // Preferred: API request
  const apiQuery = useQuery(["pools", type], {
    queryFn: () => fetchApiCurveCompounderPools({ isCurve: isCurve ?? true }),
    retry: false,
    enabled: !isToken,
  })

  const apiTokenQuery = useQuery(["pools", type], {
    queryFn: () => fetchApiTokenCompounderPools(),
    retry: false,
    enabled: isToken,
  })

  if (!isToken) {
    return {
      ...apiQuery,
      data: apiQuery.data?.find((p) => p.token.ybToken.address === address)
        ?.poolId,
    }
  }

  return {
    ...apiTokenQuery,
    data: apiTokenQuery.data?.find((p) => p.token.ybToken.address === address)
      ?.vaultId,
  }
}

import { useQuery } from "wagmi"

import {
  fetchApiCurveCompounderPools,
  fetchApiTokenCompounderPools,
} from "@/hooks/api/useApiCompounderPools"
import useVaultTokens from "@/hooks/data/useVaultTokens"
import { VaultProps } from "@/hooks/types"
import useIsCurve from "@/hooks/useIsCurve"
import useIsTokenCompounder from "@/hooks/useIsTokenCompounder"

export default function useCompounderPoolId({ asset, type }: VaultProps) {
  const isCurve = useIsCurve(type)
  const isToken = useIsTokenCompounder(type)
  const { data: vaultTokens } = useVaultTokens({
    asset,
    type,
  })
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
      data: apiQuery.data?.find(
        (p) => p.token.ybToken.address === vaultTokens.ybTokenAddress
      )?.poolId,
    }
  }

  return {
    ...apiTokenQuery,
    data: apiTokenQuery.data?.find(
      (p) => p.token.ybToken.address === vaultTokens.ybTokenAddress
    )?.vaultId,
  }
}

import { useQuery } from "@tanstack/react-query"
import { Address, useAccount, useChainId } from "wagmi"

import fortressApi, { ApiResult } from "@/lib/fortressApi"
import { ApiPool } from "@/hooks/api/useApiCompounderPools"
import { VaultType } from "@/hooks/types"
import useIsCurve from "@/hooks/useIsCurve"

export type ApiPoolDynamic = {
  chainId?: number
  isCurve?: boolean
  poolId?: number
  poolDepositedLPtokens: string
  TVL: number
  APY: number
  APR: {
    baseApr: number
    crvApr: number
    cvxApr: number
    extraRewardsApr: number
    totalApr: number
  }
  user: {
    address?: Address
    ybTokensShare: string
    LPtokensShare: string
    usdShare?: number
  }
}

export interface ApiGetPoolDynamicResult extends ApiResult {
  data?: ApiPoolDynamic
  message?: string
}

export function useApiCompounderPoolDynamic({
  type,
  poolId,
}: {
  type: VaultType
  poolId: ApiPool["poolId"]
}) {
  const isCurve = useIsCurve(type)
  const { address } = useAccount()
  const chainId = useChainId()

  return useQuery(
    [chainId, "pools", isCurve ? "curve" : "balancer", "data", poolId, address],
    {
      queryFn: () =>
        fetchApiCompounderPoolDynamic({
          chainId,
          isCurve,
          poolId,
          user: address || "0x",
        }),
      retry: false,
      enabled: poolId !== undefined,
    }
  )
}

async function fetchApiCompounderPoolDynamic({
  chainId,
  isCurve,
  poolId,
  user = "0x",
}: {
  chainId: number
  isCurve: boolean
  poolId: number | undefined
  user: Address | undefined
}) {
  const resp = await fortressApi.post<ApiGetPoolDynamicResult>(
    "AMM_Compounder/getPoolDynamicData",
    {
      isCurve,
      poolId,
      chainId,
      user,
    }
  )
  if (resp?.data?.data) return resp.data.data
  return null
}

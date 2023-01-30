import { useQuery } from "@tanstack/react-query"
import { Address, useAccount } from "wagmi"

import fortressApi, { ApiResult } from "@/lib/fortressApi"
import { ApiPool } from "@/hooks/api/useApiCompounderPools"
import { VaultType } from "@/hooks/types"
import useIsCurve from "@/hooks/useIsCurve"

import { CHAIN_ID } from "@/constant/env"

export type ApiPoolDynamic = {
  chainId?: number
  isCurve?: boolean
  poolId?: number
  poolDepositedLPTokens: string
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

  return useQuery(["pools", isCurve ? "curve" : "balancer", "data", address], {
    queryFn: () =>
      fetchApiCompounderPoolDynamic({ isCurve, poolId, user: address || "0x" }),
    retry: false,
    enabled: !!poolId,
  })
}

async function fetchApiCompounderPoolDynamic({
  isCurve,
  poolId,
  user = "0x",
}: {
  isCurve: boolean
  poolId: number | undefined
  user: Address | undefined
}) {
  if (!poolId) return null
  const resp = await fortressApi.post<ApiGetPoolDynamicResult>(
    "AMM_Compounder/getPoolDynamicData",
    {
      isCurve,
      poolId,
      chainId: CHAIN_ID,
      user,
    }
  )
  if (resp?.data?.data) return resp.data.data
  return null
}

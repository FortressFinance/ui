import { Address, useAccount, useQuery } from "wagmi"

import fortressApi, { ApiResult } from "@/lib/fortressApi"
import { ApiPool } from "@/hooks/api/useApiCompounderPools"
import { VaultType } from "@/hooks/types"
import useIsCurve from "@/hooks/useIsCurve"
import useIsTokenCompounder from "@/hooks/useIsTokenCompounder"

import { CHAIN_ID } from "@/constant/env"

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

export type ApiVaultDynamic = {
  chainId: number
  poolId: number
  poolDepositedLPtokens: number
  TVL: number
  APR: {
    BALApr: number
    AuraApr: number
    crvApr: number
    cvxApr: number
    extraRewardsApr: number
    totalApr: number
    GMXApr: number
    ETHApr: number
  }
  APY: number
  user: {
    address: string
    ybTokensShare: string
    LPTokensShare: string
    usdShare: number
  }
}

export interface ApiGetVaultDynamicResult extends ApiResult {
  data?: ApiVaultDynamic
  message?: string
}

export default function useApiCompounderPoolDynamic({
  type,
  poolId,
}: {
  type: VaultType
  poolId: ApiPool["poolId"]
}) {
  const isCurve = useIsCurve(type)
  const isToken = useIsTokenCompounder(type)
  const { address } = useAccount()

  const apiQuery = useQuery(["pools", type, "data", poolId, address], {
    queryFn: () =>
      fetchApiCompounderPoolDynamic({
        isCurve: isCurve ?? true,
        poolId,
        user: address || "0x",
      }),
    retry: false,
    enabled: poolId !== undefined && !isToken,
  })

  const apiTokenQuery = useQuery(["pools", type, "data", poolId, address], {
    queryFn: () =>
      fetchApiTokenCompounderPoolDynamic({
        poolId,
        user: address || "0x",
      }),
    retry: false,
    enabled: poolId !== undefined && isToken,
  })

  return !isToken ? apiQuery : apiTokenQuery
}

export function useApiCurveBalancerCompounderPoolDynamic({
  type,
  poolId,
}: {
  type: VaultType
  poolId: ApiPool["poolId"]
}) {
  const isCurve = useIsCurve(type)
  const { address } = useAccount()

  const apiQuery = useQuery(["pools", type, "data", poolId, address], {
    queryFn: () =>
      fetchApiCompounderPoolDynamic({
        isCurve: isCurve ?? true,
        poolId,
        user: address || "0x",
      }),
    retry: false,
    enabled: poolId !== undefined,
  })

  return apiQuery
}

export function useApiTokenCompounderPoolDynamic({
  type,
  poolId,
}: {
  type: VaultType
  poolId: ApiPool["poolId"]
}) {
  const { address } = useAccount()

  const apiTokenQuery = useQuery(["pools", type, "data", poolId, address], {
    queryFn: () =>
      fetchApiTokenCompounderPoolDynamic({
        poolId,
        user: address || "0x",
      }),
    retry: false,
    enabled: poolId !== undefined,
  })

  return apiTokenQuery
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

async function fetchApiTokenCompounderPoolDynamic({
  poolId,
  user = "0x",
}: {
  poolId: number | undefined
  user: Address | undefined
}) {
  if (!poolId) return null
  const resp = await fortressApi.post<ApiGetVaultDynamicResult>(
    "Token_Compounder/getVaultDynamicData",
    {
      vaultId: poolId,
      chainId: CHAIN_ID,
      user,
    }
  )
  if (resp?.data?.data) return resp.data.data
  return null
}

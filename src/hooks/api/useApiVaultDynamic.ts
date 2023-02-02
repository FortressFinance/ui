import { useQuery } from "@tanstack/react-query"
import { Address, useAccount } from "wagmi"

import fortressApi, { ApiResult } from "@/lib/fortressApi"
import { ApiPool } from "@/hooks/api/useApiVaults/useApiCompounderVaults"
import { VaultType } from "@/hooks/types"
import useActiveChainId from "@/hooks/useActiveChainId"
import useIsCurve from "@/hooks/useIsCurve"
import useIsTokenCompounder from "@/hooks/useIsTokenCompounder"

export type ApiCompounderVaultDynamic = {
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
  data?: ApiCompounderVaultDynamic
  message?: string
}

export type ApiTokenVaultDynamic = {
  chainId: number
  poolId: number
  poolDepositedLPtokens: number
  TVL: number
  APR: {
    BALApr: number
    AuraApr: number
    totalApr: number
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
  data?: ApiTokenVaultDynamic
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
  const chainId = useActiveChainId()

  return useQuery([chainId, "pools", type, "data", poolId, address], {
    queryFn: () =>
      isToken
        ? fetchApiTokenCompounderPoolDynamic({
            chainId,
            poolId,
            user: address || "0x",
          })
        : fetchApiCompounderPoolDynamic({
            chainId,
            isCurve: isCurve ?? true,
            poolId,
            user: address || "0x",
          }),
    retry: false,
    enabled: poolId !== undefined,
  })
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

async function fetchApiTokenCompounderPoolDynamic({
  chainId,
  poolId,
  user = "0x",
}: {
  chainId: number
  poolId: number | undefined
  user: Address | undefined
}) {
  if (!poolId) return null
  const resp = await fortressApi.post<ApiGetPoolDynamicResult>(
    "Token_Compounder/getVaultDynamicData",
    {
      vaultId: poolId,
      chainId,
      user,
    }
  )
  if (resp?.data?.data) return resp.data.data
  return null
}

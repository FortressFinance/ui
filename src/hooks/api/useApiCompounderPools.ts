import { useQuery } from "@tanstack/react-query"
import { Address } from "wagmi"

import fortressApi, { ApiResult } from "@/lib/fortressApi"
import { VaultType } from "@/hooks/types"
import useIsCurve from "@/hooks/useIsCurve"
import useIsTokenCompounder from "@/hooks/useIsTokenCompounder"

import { CHAIN_ID } from "@/constant/env"

export type ApiPool = {
  isCurve?: boolean
  poolId?: number
  poolName: string
  platformFee: string
  withdrawalFee: string
  token: {
    ybToken: {
      address: Address
      decimals?: number
      symbol?: string
      name?: string
    }
    LPtoken: {
      address: Address
      isLpToken: boolean
      decimals?: number
      symbol?: string
      name?: string
    }
    assets: {
      address: Address
      isLpToken: boolean
      decimals?: number
      symbol?: string
      name?: string
    }[]
  }
}

export type ApiTokenVault = {
  vaultId: number
  vaultName: string
  platformFee: number
  withdrawalFee: number
  token: {
    ybToken: {
      address: Address
      decimals: number
      symbol?: string
      name?: string
    }
    asset: {
      address: Address
      decimals: number
      symbol?: string
      name?: string
    }
  }
}

export interface ApiGetPoolsResult extends ApiResult {
  data?: {
    chainId: number
    pools: ApiPool[]
  }
  message?: string
}

export interface ApiGetVaultsResult extends ApiResult {
  data?: {
    chainId: number
    pools: ApiTokenVault[]
  }
  message?: string
}

export default function useApiCompounderPools({ type }: { type: VaultType }) {
  const isCurve = useIsCurve(type)
  const isToken = useIsTokenCompounder(type)

  const query = useQuery(["pools", type], {
    queryFn: () => fetchApiCurveCompounderPools({ isCurve: isCurve ?? true }),
    retry: false,
    enabled: !isToken,
  })

  const tokenQuery = useQuery(["pools", type], {
    queryFn: () => fetchApiTokenCompounderPools(),
    retry: false,
    enabled: isToken,
  })

  return !isToken ? query : tokenQuery
}

export async function fetchApiCurveCompounderPools({
  isCurve,
}: {
  isCurve: boolean
}) {
  const resp = await fortressApi.post<ApiGetPoolsResult>(
    "AMM_Compounder/getAllPoolsStaticData",
    {
      chainId: CHAIN_ID,
      isCurve,
    }
  )
  if (resp?.data?.data?.pools) {
    return resp.data.data.pools
  } else {
    return null
  }
}

export async function fetchApiTokenCompounderPools() {
  const resp = await fortressApi.post<ApiGetVaultsResult>(
    "Token_Compounder/getVaultStaticData",
    {
      chainId: CHAIN_ID,
    }
  )
  if (resp?.data?.data?.pools) {
    return resp.data.data.pools
  } else {
    return null
  }
}

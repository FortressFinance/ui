import { useQuery } from "@tanstack/react-query"
import { Address } from "wagmi"

import fortressApi, { ApiResult } from "@/lib/fortressApi"
import { VaultType } from "@/hooks/types"
import useIsCurve from "@/hooks/useIsCurve"

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

export interface ApiGetPoolsResult extends ApiResult {
  data?: {
    chainId: number
    pools: ApiPool[]
  }
  message?: string
}

export default function useApiCompounderPools({ type }: { type: VaultType }) {
  const isCurve = useIsCurve(type)

  return useQuery(["pools", type], {
    queryFn: () => fetchApiCompounderPools({ isCurve }),
    retry: false,
  })
}

export async function fetchApiCompounderPools({
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

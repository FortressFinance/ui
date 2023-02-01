import { useQuery } from "@tanstack/react-query"
import { Address } from "wagmi"

import fortressApi, { ApiResult } from "@/lib/fortressApi"
import { VaultType } from "@/hooks/types"
import useActiveChainId from "@/hooks/useActiveChainId"
import useIsCurve from "@/hooks/useIsCurve"

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
  const chainId = useActiveChainId()

  return useQuery([chainId, "pools", type], {
    queryFn: () => fetchApiCompounderPools({ chainId, isCurve }),
    retry: false,
  })
}

export async function fetchApiCompounderPools({
  chainId,
  isCurve,
}: {
  chainId: number
  isCurve: boolean
}) {
  const resp = await fortressApi.post<ApiGetPoolsResult>(
    "AMM_Compounder/getAllPoolsStaticData",
    {
      chainId,
      isCurve,
    }
  )
  if (resp?.data?.data?.pools) {
    return resp.data.data.pools
  } else {
    return null
  }
}

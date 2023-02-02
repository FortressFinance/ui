import { useQuery } from "@tanstack/react-query"
import { Address } from "wagmi"

import fortressApi, { ApiResult } from "@/lib/fortressApi"
import { VaultType } from "@/hooks/types"
import useActiveChainId from "@/hooks/useActiveChainId"
import useIsCurve from "@/hooks/useIsCurve"
import useIsTokenCompounder from "@/hooks/useIsTokenCompounder"

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
  const chainId = useActiveChainId()
  const isCurve = useIsCurve(type)
  const isToken = useIsTokenCompounder(type)

  const query = useQuery([chainId, "pools", type], {
    queryFn: () =>
      fetchApiCurveCompounderPools({ chainId, isCurve: isCurve ?? true }),
    retry: false,
    enabled: !isToken,
  })

  const tokenQuery = useQuery([chainId, "pools", type], {
    queryFn: () => fetchApiTokenCompounderPools({ chainId }),
    retry: false,
    enabled: isToken,
  })

  return !isToken ? query : tokenQuery
}

export async function fetchApiCurveCompounderPools({
  chainId,
  isCurve,
}: {
  chainId: number
  isCurve: boolean
}) {
  const resp = await fortressApi.post<ApiGetPoolsResult>(
    "AMM_Compounder/getAllPoolsStaticData",
    { chainId, isCurve }
  )
  if (resp?.data?.data?.pools) {
    return resp.data.data.pools
  } else {
    return null
  }
}

export async function fetchApiTokenCompounderPools({
  chainId,
}: {
  chainId: number
}) {
  const resp = await fortressApi.post<ApiGetVaultsResult>(
    "Token_Compounder/getVaultStaticData",
    { chainId }
  )
  if (resp?.data?.data?.pools) {
    return resp.data.data.pools
  } else {
    return null
  }
}

import { useQuery } from "@tanstack/react-query"
import { Address } from "wagmi"

import fortressApi, { ApiResult } from "@/lib/fortressApi"
import { VaultType } from "@/hooks/types"
import useActiveChainId from "@/hooks/useActiveChainId"
import useIsCurve from "@/hooks/useIsCurve"
import useIsTokenCompounder from "@/hooks/useIsTokenCompounder"

type UseApiCompounderVaultsParams = {
  type: VaultType
}

export default function useApiCompounderVaults({
  type,
}: UseApiCompounderVaultsParams) {
  const chainId = useActiveChainId()
  const isCurve = useIsCurve(type)
  const isToken = useIsTokenCompounder(type)
  return useQuery([chainId, "pools", type], {
    queryFn: () =>
      fetchApiCompounderVaults({ chainId, isCurve: isCurve ?? true }),
    retry: false,
    enabled: !isToken,
  })
}

export type UseApiCompounderVaultsResult = ReturnType<
  typeof useApiCompounderVaults
>

async function fetchApiCompounderVaults({
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
  return resp?.data?.data?.pools ?? null
}

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

interface ApiGetPoolsResult extends ApiResult {
  data?: {
    chainId: number
    pools: ApiPool[]
  }
  message?: string
}
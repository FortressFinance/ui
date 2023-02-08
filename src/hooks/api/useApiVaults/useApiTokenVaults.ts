import { Address, useQuery } from "wagmi"

import fortressApi, { ApiResult } from "@/lib/fortressApi"
import { VaultType } from "@/hooks/types"
import useActiveChainId from "@/hooks/useActiveChainId"
import useIsTokenCompounder from "@/hooks/useIsTokenCompounder"

type UseApiTokenVaultsParams = {
  type: VaultType
}

export default function useApiTokenVaults({ type }: UseApiTokenVaultsParams) {
  const chainId = useActiveChainId()
  const isToken = useIsTokenCompounder(type)
  return useQuery([chainId, "pools", type], {
    queryFn: () => fetchApiTokenVaults({ chainId }),
    retry: false,
    enabled: isToken,
  })
}

async function fetchApiTokenVaults({ chainId }: { chainId: number }) {
  const resp = await fortressApi.post<ApiGetVaultsResult>(
    "Token_Compounder/getVaultStaticData",
    { chainId }
  )
  return resp?.data?.data?.pools ?? null
}

export type UseApiTokenVaultsResult = ReturnType<typeof useApiTokenVaults>

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
    baseAsset: {
      address: Address
      decimals: number
      symbol?: string
      name?: string
    }
    underlyingAssets: {
      address: Address
      decimals: number
      symbol?: string
      name?: string
    }[]
  }
}

interface ApiGetVaultsResult extends ApiResult {
  data?: {
    chainId: number
    pools: ApiTokenVault[]
  }
  message?: string
}

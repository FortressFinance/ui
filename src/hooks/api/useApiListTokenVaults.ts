import { useQuery } from "@tanstack/react-query"
import { Address } from "wagmi"

import fortressApi, { ApiResult } from "@/lib/fortressApi"
import { VaultType } from "@/hooks/types"
import useActiveChainId from "@/hooks/useActiveChainId"
import useIsTokenCompounder from "@/hooks/useIsTokenCompounder"

export default function useApiListTokenVaults({ type }: { type: VaultType }) {
  const chainId = useActiveChainId()
  const isToken = useIsTokenCompounder(type)

  return useQuery([chainId, "pools", "token", type], {
    queryFn: () => fetchApiTokenVaults({ chainId }),
    retry: false,
    enabled: isToken,
  })
}

async function fetchApiTokenVaults({ chainId }: { chainId: number }) {
  const resp = await fortressApi.post<ApiGetVaultsResult>(
    "Token_Compounder/getVaultStaticData",
    {
      chainId,
    }
  )
  if (resp?.data?.data?.pools) {
    return resp.data.data.pools
  } else {
    return null
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

export interface ApiGetVaultsResult extends ApiResult {
  data?: {
    chainId: number
    pools: ApiTokenVault[]
  }
  message?: string
}

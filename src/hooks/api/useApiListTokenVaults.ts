import { useQuery } from "@tanstack/react-query"
import { Address } from "wagmi"

import fortressApi, { ApiResult } from "@/lib/fortressApi"
import { VaultType } from "@/hooks/types"
import useIsTokenCompounder from "@/hooks/useIsTokenCompounder"

import { CHAIN_ID } from "@/constant/env"

export default function useApiListTokenVaults({ type }: { type: VaultType }) {
  const isToken = useIsTokenCompounder(type)

  return useQuery(["pools", "token", type], {
    queryFn: fetchApiTokenVaults,
    retry: false,
    enabled: isToken,
  })
}

async function fetchApiTokenVaults() {
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
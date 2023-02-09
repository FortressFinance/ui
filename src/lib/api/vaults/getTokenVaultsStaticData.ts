import { Address } from "wagmi"

import { fortressApi, handledResponse } from "@/lib/api/util"

export type TokenVaultStaticData = {
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

export type GetTokenVaultsStaticDataBody = {
  chainId: number
  pools: TokenVaultStaticData[]
}

export async function getTokenVaultsStaticData({
  chainId,
}: {
  chainId: number
}) {
  const resp = await fortressApi.post<GetTokenVaultsStaticDataBody>(
    "Token_Compounder/getVaultStaticData",
    { chainId }
  )
  return handledResponse(resp?.data?.data?.pools)
}

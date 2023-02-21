import { Address } from "wagmi"

import { fortressApi, handledResponse } from "@/lib/api/util"

export type TokenVaultStaticData = {
  id: number
  name: string
  platformFee: number
  withdrawalFee: number
  token: {
    ybToken: {
      address: Address
      decimals: number
      symbol?: string
      name?: string
    }
    primaryAsset: {
      address: Address
      decimals: number
      symbol?: string
      name?: string
    }
    assets: {
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

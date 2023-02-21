import { Address } from "wagmi"

import { fortressApi, handledResponse } from "@/lib/api/util"

export type CompounderVaultStaticData = {
  isCurve?: boolean
  id?: number
  name: string
  platformFee: string
  withdrawalFee: string
  token: {
    ybToken: {
      address: Address
      decimals?: number
      symbol?: string
      name?: string
    }
    primaryAsset: {
      address: Address
      isLpToken: boolean
      decimals?: number
      symbol?: string
      name?: string
    }
    underlyingAssets: {
      address: Address
      isLpToken: boolean
      decimals?: number
      symbol?: string
      name?: string
    }[]
  }
}

export type GetCompounderVaultsStaticDataBody = {
  chainId: number
  pools: CompounderVaultStaticData[]
}

export async function getCompounderVaultsStaticData({
  chainId,
  isCurve,
}: {
  chainId: number
  isCurve: boolean
}) {
  const resp = await fortressApi.post<GetCompounderVaultsStaticDataBody>(
    "AMM_Compounder/getAllPoolsStaticData",
    { chainId, isCurve }
  )
  return handledResponse(resp?.data?.data?.pools)
}

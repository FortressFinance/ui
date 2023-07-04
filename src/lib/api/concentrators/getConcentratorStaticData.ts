import { Address } from "wagmi"

import { fortressApi, handledResponse } from "@/lib/api/util"

export type ConcentratorStaticData = {
  name: string
  target_asset: {
    targetAssetId: number
    address: Address
    type: string
  }
  concentrator: {
    platformFee?: string
    harvestBounty?: string
    withdrawalFee?: string
    ybToken: {
      concentratorId: number
      address: Address
      decimals?: number
      symbol?: string
      name?: string
    }
    primaryAsset: {
      address: Address
      decimals?: number
      symbol?: string
      name?: string
      isLpToken?: boolean
    }
    undelyingAssets: {
      address: Address
      decimals?: number
      symbol?: string
      name?: string
      isLpToken?: boolean
    }[]
  }
}

export type GetConcentratorStaticDataBody = {
  chainId: number
  isCurve: boolean
  pools: ConcentratorStaticData[]
}

export async function getConcentratorStaticData({
  chainId,
}: {
  chainId: number
}) {
  const resp = await fortressApi.post<GetConcentratorStaticDataBody>(
    "Concentrator/getStaticData",
    { chainId, isCurve: true }
  )
  return handledResponse(resp?.data?.data?.pools)
}

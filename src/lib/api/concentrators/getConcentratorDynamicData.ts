import { Address } from "wagmi"

import { fortressApi, handledResponse } from "@/lib/api/util"

export type ConcentratorDynamicData = {
  chainId: number
  target_asset_id: number
  concentrator_id: number
  blockExplorerUrls: {
    targetAsset: string
    concentratorPrimaryAsset: string
    concentratorYbToken: string
  }
  concentratorPrimaryAssets: string
  TVL: string
  APY: {
    concentrator_APR_breakdown: {
      baseApr: number
      crvApr: number
      cvxApr: number
      extraRewards: number[]
      totalApr: number
    }
    concentrator_APR: number
    compounderAPR_breakdown: {
      GMXApr: number
      ETHApr: number
      totalApr: number
    }
    compounderAPY: number
    totalAPY: number
  }
  userShare: {
    address?: Address
    concentratorPrimaryAssets: string
    concentratorUSD: string
    compounderPrimaryAssets: string
    compounderUSD: string
  }
}

export async function getConcentratorDynamicData({
  chainId,
  isCurve,
  targetAssetId,
  concentratorId,
  user,
}: {
  chainId: number
  isCurve: boolean
  targetAssetId: number
  concentratorId: number
  user: Address
}) {
  const resp = await fortressApi.post<ConcentratorDynamicData>(
    "Concentrator/getDynamicData",
    { chainId, isCurve, targetAssetId, concentratorId, user }
  )
  return handledResponse(resp?.data?.data)
}

import { Address } from "wagmi"

import { handledResponse } from "@/lib/api/util"
import fortressApi from "@/lib/fortressApi"

export type VaultDynamicData = {
  id: number
  chainId: number
  poolDepositedPrimaryAssets: string
  TVL: number
  APY: number
  APR: {
    // compounder vault APRs
    baseApr?: number
    crvApr?: number
    cvxApr?: number
    extraRewardsApr?: number
    totalApr?: number
    // token vault APRs
    BALApr?: number
    AuraApr?: number
    GMXApr?: number
    ETHApr?: number
  }
  userShare: {
    address: Address | null
    ybToken: string
    primaryAsset: string
    usd: number
  }
  blockExplorerUrls: {
    primaryAsset: string
    ybToken: string
  }
}

export async function getCompounderVaultDynamicData({
  chainId,
  isCurve,
  id,
  user = "0x",
}: {
  chainId: number
  isCurve: boolean
  id: number | undefined
  user: Address | undefined
}) {
  const resp = await fortressApi.post<VaultDynamicData>(
    "AMM_Compounder/getPoolDynamicData",
    { isCurve, chainId, id, user }
  )
  return handledResponse(resp?.data?.data)
}

export async function getTokenVaultDynamicData({
  chainId,
  id,
  user = "0x",
}: {
  chainId: number
  id: number | undefined
  user: Address | undefined
}) {
  const resp = await fortressApi.post<VaultDynamicData>(
    "Token_Compounder/getVaultDynamicData",
    { chainId, id, user }
  )
  return handledResponse(resp?.data?.data)
}

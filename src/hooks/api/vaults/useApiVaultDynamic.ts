import { Address, useAccount, useQuery } from "wagmi"

import { fortressApi } from "@/lib/api/util"
import { CompounderVaultStaticData } from "@/lib/api/vaults"
import { VaultType } from "@/lib/types"
import useActiveChainId from "@/hooks/useActiveChainId"
import useIsCurve from "@/hooks/useIsCurve"
import useIsTokenCompounder from "@/hooks/useIsTokenCompounder"

export type ApiCompounderVaultDynamic = {
  chainId?: number
  isCurve?: boolean
  poolId?: number
  poolDepositedLPtokens: string
  TVL: number
  APY: number
  APR: {
    baseApr: number
    crvApr: number
    cvxApr: number
    extraRewardsApr: number
    totalApr: number
    BALApr: number
    AuraApr: number
    GMXApr: number
    ETHApr: number
  }
  user: {
    address?: Address
    ybTokensShare: string
    LPtokensShare: string
    usdShare?: number
  }
}

export function useApiVaultDynamic({
  type,
  poolId,
}: {
  type: VaultType
  poolId: CompounderVaultStaticData["poolId"]
}) {
  const isCurve = useIsCurve(type)
  const isToken = useIsTokenCompounder(type)
  const { address } = useAccount()
  const chainId = useActiveChainId()

  return useQuery([chainId, "pools", type, "data", poolId, address], {
    queryFn: () =>
      isToken
        ? fetchApiTokenVaultDynamic({
            chainId,
            poolId,
            user: address || "0x",
          })
        : fetchApiCompounderVaultDynamic({
            chainId,
            isCurve: isCurve ?? true,
            poolId,
            user: address || "0x",
          }),
    retry: false,
    enabled: poolId !== undefined,
  })
}

async function fetchApiCompounderVaultDynamic({
  chainId,
  isCurve,
  poolId,
  user = "0x",
}: {
  chainId: number
  isCurve: boolean
  poolId: number | undefined
  user: Address | undefined
}) {
  const resp = await fortressApi.post<ApiCompounderVaultDynamic>(
    "AMM_Compounder/getPoolDynamicData",
    {
      isCurve,
      poolId,
      chainId,
      user,
    }
  )
  if (resp?.data?.data) return resp.data.data
  return null
}

async function fetchApiTokenVaultDynamic({
  chainId,
  poolId,
  user = "0x",
}: {
  chainId: number
  poolId: number | undefined
  user: Address | undefined
}) {
  if (!poolId) return null
  const resp = await fortressApi.post<ApiCompounderVaultDynamic>(
    "Token_Compounder/getVaultDynamicData",
    {
      vaultId: poolId,
      chainId,
      user,
    }
  )
  if (resp?.data?.data) return resp.data.data
  return null
}

import { UseQueryResult } from "@tanstack/react-query"
import { Address } from "wagmi"

import {
  CompounderVaultStaticData,
  TokenVaultStaticData,
} from "@/lib/api/vaults"

export function findApiCompounderVaultForAsset(
  data: UseQueryResult<CompounderVaultStaticData[]>["data"],
  asset: Address | undefined
) {
  return data?.find((v) => v.token.LPtoken.address === asset)
}

export function findApiTokenVaultForAsset(
  data: UseQueryResult<TokenVaultStaticData[]>["data"],
  asset: Address | undefined
) {
  return data?.find((v) => v.token.baseAsset.address === asset)
}

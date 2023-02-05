import { UseQueryResult } from "@tanstack/react-query"
import { Address } from "wagmi"

import { ApiPool } from "@/hooks/api/useApiVaults/useApiCompounderVaults"
import { ApiTokenVault } from "@/hooks/api/useApiVaults/useApiTokenVaults"

export function findApiCompounderVaultForAsset(
  data: UseQueryResult<ApiPool[]>["data"],
  asset: Address | undefined
) {
  return data?.find((v) => v.token.LPtoken.address === asset)
}

export function findApiTokenVaultForAsset(
  data: UseQueryResult<ApiTokenVault[]>["data"],
  asset: Address | undefined
) {
  return data?.find((v) => v.token.baseAsset.address === asset)
}

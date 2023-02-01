import { UseQueryResult } from "@tanstack/react-query"
import { Address } from "wagmi"

import { ApiPool } from "@/hooks/api/useApiListCompounderVaults"
import { ApiTokenVault } from "@/hooks/api/useApiListTokenVaults"

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
  return data?.find((v) => v.token.asset.address === asset)
}

import { Address } from "wagmi"

import { useApiConcentratorPrimaryAssets } from "@/hooks/lib/api/useApiConcentratorPrimaryAssets"
import { useConcentratorPrimaryAssets } from "@/hooks/useConcentratorPrimaryAssets"

type ListConcentratorsProps = {
  concentratorTargetAssets?: Address[]
  enabled?: boolean
}

export function useListConcentrators({
  concentratorTargetAssets,
  enabled,
}: ListConcentratorsProps) {
  const apiQuery = useApiConcentratorPrimaryAssets({
    concentratorTargetAssets,
    enabled,
  })
  const primaryAssets = useConcentratorPrimaryAssets({
    concentratorTargetAssets,
    enabled: apiQuery.isError && enabled,
  })

  if (apiQuery.isError) {
    return {
      ...primaryAssets,
      data: primaryAssets.data,
    }
  }
  return apiQuery
}

import { Address } from "wagmi"

import { useApiConcentratorPrimaryAssets } from "@/hooks/lib/api/useApiConcentratorPrimaryAssets"
import { useConcentratorPrimaryAssets } from "@/hooks/useConcentratorPrimaryAssets"

export function useListConcentrators({
  concentratorTargetAssets,
}: {
  concentratorTargetAssets?: Address[]
}) {
  const apiQuery = useApiConcentratorPrimaryAssets({
    concentratorTargetAssets,
    enabled: true,
  })
  const primaryAssets = useConcentratorPrimaryAssets({
    concentratorTargetAssets,
    enabled: apiQuery.isError,
  })

  if (apiQuery.isError) {
    return {
      ...primaryAssets,
      data: primaryAssets.data,
    }
  }
  return apiQuery
}

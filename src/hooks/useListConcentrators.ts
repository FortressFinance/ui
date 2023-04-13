import { Address } from "wagmi"

import { useApiConcentratorPrimaryAssets } from "@/hooks/lib/api/useApiConcentratorPrimaryAssets"
import { useConcentratorPrimaryAssets } from "@/hooks/useConcentratorPrimaryAssets"

export function useListConcentrators({
  concentratorTargetAssets,
}: {
  concentratorTargetAssets: Address[] | undefined
}) {
  const apiQuery = useApiConcentratorPrimaryAssets({ concentratorTargetAssets })
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

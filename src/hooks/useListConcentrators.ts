import { Address } from "wagmi"

import { useConcentratorPrimaryAssets } from "@/hooks/useConcentratorPrimaryAssets"

type ListConcentratorsProps = {
  concentratorTargetAssets?: Address[]
  enabled?: boolean
}

export function useListConcentrators({
  concentratorTargetAssets,
  enabled,
}: ListConcentratorsProps) {
  return useConcentratorPrimaryAssets({
    concentratorTargetAssets,
    enabled,
  })
}

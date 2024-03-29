import { Address } from "wagmi"

import { useFirstConcentrator } from "@/hooks/useConcentratorHelpers"
import { useConcentratorTargetAssets } from "@/hooks/useConcentratorTargetAssets"
import { useListConcentrators } from "@/hooks/useListConcentrators"

type FirstVaultProps = {
  targetAsset: Address
  enabled?: boolean
}

export function useConcentratorFirstVaultType({
  targetAsset,
  enabled,
}: FirstVaultProps) {
  const { data: concentratorTargetAssets } = useConcentratorTargetAssets({
    onSuccess: undefined,
    enabled,
  })
  const concentratorsList = useListConcentrators({
    concentratorTargetAssets,
    enabled,
  })
  const firstConcentrator = useFirstConcentrator({
    concentratorsList,
    concentratorTargetAsset: targetAsset,
  })
  return firstConcentrator?.vaultType
}

import { Address } from "wagmi"

import { useFirstConcentrator } from "@/hooks/useConcentratorHelpers"
import { useConcentratorTargetAssets } from "@/hooks/useConcentratorTargetAssets"
import { useListConcentrators } from "@/hooks/useListConcentrators"

export function useConcentratorFirstVaultType({
  targetAsset,
}: {
  targetAsset: Address
}) {
  const { data: concentratorTargetAssets } = useConcentratorTargetAssets()
  const concentratorsList = useListConcentrators({ concentratorTargetAssets })
  const firstConcentrator = useFirstConcentrator({
    concentratorsList,
    concentratorTargetAsset: targetAsset,
  })
  return firstConcentrator?.vaultType
}

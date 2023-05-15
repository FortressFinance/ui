import { useCompounderVaultFees } from "@/hooks/useCompounderVaultFees"
import { useConcentratorVaultFees } from "@/hooks/useConcentratorVaultFees"

import { VaultRowPropsWithProduct } from "@/components/VaultRow"

export function useVaultFees({
  productType,
  ...vaultProps
}: VaultRowPropsWithProduct) {
  const isCompounderProduct = productType === "compounder"

  const compounderVaultFees = useCompounderVaultFees(vaultProps)
  const concentratorVaultFees = useConcentratorVaultFees(vaultProps)

  if (isCompounderProduct) {
    return compounderVaultFees
  }

  return concentratorVaultFees
}

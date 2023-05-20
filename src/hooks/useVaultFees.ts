import { useCompounderVaultFees } from "@/hooks/useCompounderVaultFees"
import { useConcentratorVaultFees } from "@/hooks/useConcentratorVaultFees"

import { VaultRowPropsWithProduct } from "@/components/VaultRow"

export function useVaultFees({
  productType,
  ...vaultProps
}: VaultRowPropsWithProduct) {
  const compounderVaultFees = useCompounderVaultFees({
    ...vaultProps,
    enabled: productType === "compounder",
  })
  const concentratorVaultFees = useConcentratorVaultFees({
    ...vaultProps,
    enabled: productType === "concentrator",
  })

  if (productType === "compounder") {
    return compounderVaultFees
  }

  if (productType === "concentrator") {
    return concentratorVaultFees
  }

  // managed vault
  return {
    isLoading: false,
    data: {
      depositFee: "0",
      managementFee: "0",
      platformFee: 0.5,
      withdrawFee: 0.1,
    },
  }
}

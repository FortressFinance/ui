import { FC } from "react"

import { CompounderVaultApy } from "@/components/Compounder"
import { ConcentratorVaultApy } from "@/components/Concentrator"
import { ManagedVaultsApy } from "@/components/ManagedVaults"
import { VaultRowPropsWithProduct } from "@/components/VaultRow"

export const VaultApy: FC<VaultRowPropsWithProduct> = ({
  productType = "compounder",
  ...props
}) => {
  return (
    <>
      {productType === "compounder" ? (
        <CompounderVaultApy {...props} />
      ) : productType === "concentrator" ? (
        <ConcentratorVaultApy {...props} />
      ) : (
        <ManagedVaultsApy />
      )}
    </>
  )
}

import { FC } from "react"

import { CompounderVaultUserBalance } from "@/components/Compounder"
import { ConcentratorVaultUserBalance } from "@/components/Concentrator"
import { ManagedVaultsUserBalance } from "@/components/ManagedVaults"
import { VaultRowPropsWithProduct } from "@/components/VaultRow"

export const VaultUserBalance: FC<VaultRowPropsWithProduct> = ({
  productType = "compounder",
  ...props
}) => {
  return (
    <>
      {productType === "compounder" ? (
        <CompounderVaultUserBalance {...props} />
      ) : productType === "concentrator" ? (
        <ConcentratorVaultUserBalance {...props} />
      ) : (
        <ManagedVaultsUserBalance />
      )}
    </>
  )
}

import { FC } from "react"

import { CompounderVaultTvl } from "@/components/Compounder"
import { ConcentratorVaultTvl } from "@/components/Concentrator"
import { ManagedVaultsTvl } from "@/components/ManagedVaults"
import { VaultRowPropsWithProduct } from "@/components/VaultRow/VaultRow"

export const VaultTvl: FC<VaultRowPropsWithProduct> = ({
  productType = "compounder",
  ...props
}) => {
  return (
    <>
      {productType === "compounder" ? (
        <CompounderVaultTvl {...props} />
      ) : productType === "concentrator" ? (
        <ConcentratorVaultTvl {...props} />
      ) : (
        <ManagedVaultsTvl />
      )}
    </>
  )
}

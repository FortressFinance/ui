import { FC } from "react"

import { CompounderVaultApy } from "@/components/Compounder"
import { ConcentratorVaultApy } from "@/components/Concentrator"
import { VaultRowPropsWithProduct } from "@/components/VaultRow"

export const VaultApy: FC<VaultRowPropsWithProduct> = ({
  productType = "compounder",
  ...props
}) => {
  const isCompounderProduct = productType === "compounder"

  return (
    <>
      {isCompounderProduct ? (
        <CompounderVaultApy {...props} />
      ) : (
        <ConcentratorVaultApy {...props} />
      )}
    </>
  )
}

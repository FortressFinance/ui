import { FC } from "react"

import { CompounderVaultTvl } from "@/components/Compounder"
import { ConcentratorVaultTvl } from "@/components/Concentrator"
import { VaultRowPropsWithProduct } from "@/components/VaultRow/VaultRow"

export const VaultTvl: FC<VaultRowPropsWithProduct> = ({
  productType = "compounder",
  ...props
}) => {
  const isCompounderProduct = productType === "compounder"

  return (
    <>
      {isCompounderProduct ? (
        <CompounderVaultTvl {...props} />
      ) : (
        <ConcentratorVaultTvl {...props} />
      )}
    </>
  )
}

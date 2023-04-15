import { FC } from "react"

import { CompounderVaultName } from "@/components/Compounder"
import { ConcentratorVaultName } from "@/components/Concentrator"
import { VaultRowPropsWithProduct } from "@/components/VaultRow/VaultRow"

export const VaultName: FC<VaultRowPropsWithProduct> = ({
  productType,
  ...props
}) => {
  const isCompounderProduct = productType === "compounder"

  return (
    <>
      {isCompounderProduct ? (
        <CompounderVaultName {...props} />
      ) : (
        <ConcentratorVaultName {...props} />
      )}
    </>
  )
}

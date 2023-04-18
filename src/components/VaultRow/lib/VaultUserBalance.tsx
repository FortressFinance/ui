import { FC } from "react"

import { CompounderVaultUserBalance } from "@/components/Compounder"
import { ConcentratorVaultUserBalance } from "@/components/Concentrator"
import { VaultRowPropsWithProduct } from "@/components/VaultRow"

export const VaultUserBalance: FC<VaultRowPropsWithProduct> = ({
  productType = "compounder",
  ...props
}) => {
  const isCompounderProduct = productType === "compounder"

  return (
    <>
      {isCompounderProduct ? (
        <CompounderVaultUserBalance {...props} />
      ) : (
        <ConcentratorVaultUserBalance {...props} />
      )}
    </>
  )
}

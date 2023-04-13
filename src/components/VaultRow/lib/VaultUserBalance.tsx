import { FC } from "react"

import { CompounderVaultProps, ConcentratorVaultProps } from "@/lib/types"
import { useIsCompounderProduct } from "@/hooks/useVaultProduct"

import { CompounderVaultUserBalance } from "@/components/Compounder"
import { ConcentratorVaultUserBalance } from "@/components/Concentrator"
import { VaultRowPropsWithProduct } from "@/components/VaultRow"

export const VaultUserBalance: FC<VaultRowPropsWithProduct> = ({
  productType = "compounder",
  ...props
}) => {
  const isCompounderProduct = useIsCompounderProduct(productType)
  const compounderProps = props as CompounderVaultProps
  const concentratorProps = props as ConcentratorVaultProps

  return (
    <>
      {isCompounderProduct ? (
        <CompounderVaultUserBalance {...compounderProps} />
      ) : (
        <ConcentratorVaultUserBalance {...concentratorProps} />
      )}
    </>
  )
}

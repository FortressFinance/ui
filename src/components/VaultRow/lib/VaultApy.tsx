import { FC } from "react"

import { CompounderVaultProps, ConcentratorVaultProps } from "@/lib/types"
import { useIsCompounderProduct } from "@/hooks/useVaultProduct"

import { CompounderVaultApy } from "@/components/Compounder"
import { ConcentratorVaultApy } from "@/components/Concentrator"
import { VaultRowPropsWithProduct } from "@/components/VaultRow"

export const VaultApy: FC<VaultRowPropsWithProduct> = ({
  productType = "compounder",
  ...props
}) => {
  const isCompounderProduct = useIsCompounderProduct(productType)
  const compounderProps = props as CompounderVaultProps
  const concentratorProps = props as ConcentratorVaultProps

  return (
    <>
      {isCompounderProduct ? (
        <CompounderVaultApy {...compounderProps} />
      ) : (
        <ConcentratorVaultApy {...concentratorProps} />
      )}
    </>
  )
}

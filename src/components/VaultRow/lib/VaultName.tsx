import { FC } from "react"

import { CompounderVaultProps, ConcentratorVaultProps } from "@/lib/types"
import { useIsCompounderProduct } from "@/hooks/useVaultProduct"

import { CompounderVaultName } from "@/components/Compounder"
import { ConcentratorVaultName } from "@/components/Concentrator"
import { VaultRowPropsWithProduct } from "@/components/VaultRow/VaultRow"

export const VaultName: FC<VaultRowPropsWithProduct> = ({
  productType,
  ...props
}) => {
  const isCompounderProduct = useIsCompounderProduct(
    productType ?? "compounder"
  )
  const compounderProps = props as CompounderVaultProps
  const concentratorProps = props as ConcentratorVaultProps

  return (
    <>
      {isCompounderProduct ? (
        <CompounderVaultName {...compounderProps} />
      ) : (
        <ConcentratorVaultName {...concentratorProps} />
      )}
    </>
  )
}

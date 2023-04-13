import { FC } from "react"

import { CompounderVaultProps, ConcentratorVaultProps } from "@/lib/types"
import { useIsCompounderProduct } from "@/hooks/useVaultProduct"

import { CompounderVaultTvl } from "@/components/Compounder"
import { ConcentratorVaultTvl } from "@/components/Concentrator"
import { VaultRowPropsWithProduct } from "@/components/VaultRow/VaultRow"

export const VaultTvl: FC<VaultRowPropsWithProduct> = ({
  productType = "compounder",
  ...props
}) => {
  const isCompounderProduct = useIsCompounderProduct(productType)
  const compounderProps = props as CompounderVaultProps
  const concentratorProps = props as ConcentratorVaultProps

  return (
    <>
      {isCompounderProduct ? (
        <CompounderVaultTvl {...compounderProps} />
      ) : (
        <ConcentratorVaultTvl {...concentratorProps} />
      )}
    </>
  )
}

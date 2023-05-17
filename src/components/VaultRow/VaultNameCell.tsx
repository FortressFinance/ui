import { FC } from "react"

import {
  CompounderVaultNameCell,
  ConcentratorVaultNameCell,
  ManagedVaultsNameCell,
} from "@/components/VaultRow"
import { VaultRowPropsWithProduct } from "@/components/VaultRow/VaultRow"

export const VaultNameCell: FC<VaultRowPropsWithProduct> = (props) => {
  if (props.productType === "compounder") {
    return <CompounderVaultNameCell {...props} />
  }
  if (props.productType === "concentrator") {
    return <ConcentratorVaultNameCell {...props} />
  }
  return <ManagedVaultsNameCell {...props} />
}

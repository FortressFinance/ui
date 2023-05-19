import { FC } from "react"

import { CompounderRightPanel } from "@/components/Modal/VaultStrategyModal/compounder"
import { ConcentratorRightPanel } from "@/components/Modal/VaultStrategyModal/concentrator"
import { ManagedVaultsRightPanel } from "@/components/Modal/VaultStrategyModal/managedVaults"
import { VaultRowPropsWithProduct } from "@/components/VaultRow"

export const VaultStrategyRightPanel: FC<VaultRowPropsWithProduct> = ({
  ...vaultProps
}) => {
  const productType = vaultProps.productType
  if (productType === "compounder") {
    return <CompounderRightPanel {...vaultProps} />
  }
  if (productType === "concentrator") {
    return <ConcentratorRightPanel {...vaultProps} />
  }

  return <ManagedVaultsRightPanel {...vaultProps} />
}

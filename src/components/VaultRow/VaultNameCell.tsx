import { FC } from "react"

import { AssetLogo } from "@/components/Asset"
import { VaultName } from "@/components/VaultRow/lib"
import { ManagedVaultsNameCell } from "@/components/VaultRow/managedVaults"
import { VaultRowPropsWithProduct } from "@/components/VaultRow/VaultRow"

export const VaultNameCell: FC<VaultRowPropsWithProduct> = (props) => {
  const producType = props.productType
  const vaultAddress = props.vaultAddress

  if (producType !== "managedVaults") {
    return (
      <>
        <AssetLogo className="flex h-12 w-12" tokenAddress={vaultAddress} />

        <span className="line-clamp-2 max-lg:mr-8">
          <VaultName {...props} />
        </span>
      </>
    )
  }
  return <ManagedVaultsNameCell {...props} />
}

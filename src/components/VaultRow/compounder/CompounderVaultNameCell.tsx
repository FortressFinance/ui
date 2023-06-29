import { FC } from "react"

import { AssetLogo } from "@/components/Asset"
import { VaultName } from "@/components/VaultRow/lib"
import { VaultRowPropsWithProduct } from "@/components/VaultRow/VaultRow"

export const CompounderVaultNameCell: FC<VaultRowPropsWithProduct> = (
  props
) => {
  const vaultAddress = props.vaultAddress
  return (
    <>
      <AssetLogo className="flex h-12 w-12" tokenAddress={vaultAddress} />

      <span className="max-lg:mr-8">
        <VaultName {...props} />
      </span>
    </>
  )
}

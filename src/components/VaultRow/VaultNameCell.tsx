import { FC } from "react"

import { useDoubleTokenConfig } from "@/hooks/useDoubleTokenConfig"

import { AssetLogo } from "@/components/Asset"
import { AssetDoubleLogo } from "@/components/Asset/AssetDoubleLogo"
import { VaultName } from "@/components/VaultRow/lib"
import { VaultRowPropsWithProduct } from "@/components/VaultRow/VaultRow"

export const VaultNameCell: FC<VaultRowPropsWithProduct> = (props) => {
  const doubleTokens = useDoubleTokenConfig()
  const producType = props.productType
  const vaultAddress = props.vaultAddress
  const ybTokenAddress = props.ybTokenAddress ?? "0x"
  const [mainInputToken, secondInputToken] =
    doubleTokens?.[ybTokenAddress] ?? []

  if (producType === "compounder") {
    return (
      <>
        <AssetLogo className="flex h-12 w-12" tokenAddress={vaultAddress} />

        <span className="line-clamp-2 max-lg:mr-8">
          <VaultName {...props} />
        </span>
      </>
    )
  }
  return (
    <>
      <AssetDoubleLogo
        className="flex h-12 w-12"
        mainTokenAddress={mainInputToken}
        secondTokenAddress={secondInputToken}
      />

      <span className="line-clamp-2 max-lg:mr-8">
        <VaultName {...props} vaultAddress={ybTokenAddress} />
      </span>
    </>
  )
}

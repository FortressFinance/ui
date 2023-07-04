import { FC } from "react"

import { useConcentratorVaultYbtokenAddress } from "@/hooks"
import { useDoubleTokenConfig } from "@/hooks/useDoubleTokenConfig"

import { AssetDoubleLogo } from "@/components/Asset/AssetDoubleLogo"
import { VaultName } from "@/components/VaultRow/lib"
import { VaultRowPropsWithProduct } from "@/components/VaultRow/VaultRow"

export const ConcentratorVaultNameCell: FC<VaultRowPropsWithProduct> = (
  props
) => {
  const doubleTokens = useDoubleTokenConfig()
  const ybTokenAddress = useConcentratorVaultYbtokenAddress({
    targetAsset: props.asset,
    primaryAsset: props.vaultAddress,
    enabled: true,
  })
  const [mainInputToken, secondInputToken] =
    doubleTokens?.[ybTokenAddress] ?? []
  return (
    <>
      <AssetDoubleLogo
        className="flex h-12 w-12"
        mainTokenAddress={mainInputToken}
        secondTokenAddress={secondInputToken}
      />

      <span className="max-lg:mr-8">
        <VaultName {...props} vaultAddress={ybTokenAddress} />
      </span>
    </>
  )
}

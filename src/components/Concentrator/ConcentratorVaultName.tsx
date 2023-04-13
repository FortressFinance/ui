import { FC } from "react"

import { ConcentratorVaultProps } from "@/lib/types"
import { useVault } from "@/hooks"

import Skeleton from "@/components/Skeleton"

export const ConcentratorVaultName: FC<ConcentratorVaultProps> = (props) => {
  const vault = useVault({
    asset: props.primaryAsset,
    vaultAddress: props.targetAsset,
  })

  return (
    <Skeleton isLoading={vault.isLoading} loadingText="Loading vault">
      {vault.data?.name}
    </Skeleton>
  )
}

import { FC } from "react"

import { VaultProps } from "@/lib/types"
import { useVault } from "@/hooks"

import Skeleton from "@/components/Skeleton"

export const ConcentratorVaultName: FC<VaultProps> = (props) => {
  const vault = useVault({
    asset: props.asset,
    vaultAddress: props.vaultAddress,
  })

  return (
    <Skeleton isLoading={vault.isLoading} loadingText="Loading vault">
      {vault.data?.name}
    </Skeleton>
  )
}

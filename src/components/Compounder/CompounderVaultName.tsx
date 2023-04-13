import { FC } from "react"

import { CompounderVaultProps } from "@/lib/types"
import { useVault } from "@/hooks"

import Skeleton from "@/components/Skeleton"

export const CompounderVaultName: FC<CompounderVaultProps> = (props) => {
  const vault = useVault(props)

  return (
    <Skeleton isLoading={vault.isLoading} loadingText="Loading vault">
      {vault.data?.name}
    </Skeleton>
  )
}

import { FC } from "react"

import { VaultProps } from "@/lib/types"
import { useVault } from "@/hooks"

import Skeleton from "@/components/Skeleton"

export const VaultName: FC<VaultProps> = (props) => {
  const vault = useVault(props)

  return (
    <Skeleton
      isLoading={vault.isLoading}
      loadingText="Loading vault"
      className="float-left"
    >
      {vault.data?.name}
    </Skeleton>
  )
}

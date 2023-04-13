import { FC } from "react"
import { Address } from "wagmi"

import { useVault } from "@/hooks"

import Skeleton from "@/components/Skeleton"

export const VaultName: FC<{
  asset: Address
  vaultAddress: Address
}> = (props) => {
  const vault = useVault(props)

  return (
    <Skeleton isLoading={vault.isLoading} loadingText="Loading vault">
      {vault.data?.name}
    </Skeleton>
  )
}

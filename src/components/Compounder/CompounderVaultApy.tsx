import { FC } from "react"

import { formatPercentage } from "@/lib/helpers/formatPercentage"
import { VaultProps } from "@/lib/types"
import { useVaultApy } from "@/hooks"

import Skeleton from "@/components/Skeleton"

export const CompounderVaultApy: FC<VaultProps> = (props) => {
  const totalApy = useVaultApy({ ...props })

  return (
    <Skeleton isLoading={totalApy.isLoading}>
      {formatPercentage(totalApy.data)}
    </Skeleton>
  )
}

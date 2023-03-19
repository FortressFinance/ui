import { FC } from "react"

import { formatPercentage } from "@/lib/helpers/formatPercentage"
import { VaultProps } from "@/lib/types"
import { useVaultApy, useVaultPoolId } from "@/hooks"

import Skeleton from "@/components/Skeleton"

export const VaultApy: FC<VaultProps> = (props) => {
  const poolId = useVaultPoolId(props)
  const totalApy = useVaultApy({ ...props, poolId: poolId.data })

  return (
    <Skeleton isLoading={poolId.isLoading || totalApy.isLoading}>
      {formatPercentage(totalApy.data)}
    </Skeleton>
  )
}

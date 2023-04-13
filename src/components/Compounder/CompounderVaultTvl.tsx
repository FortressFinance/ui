import { FC } from "react"

import { formatUsd } from "@/lib/helpers/formatCurrency"
import { CompounderVaultProps } from "@/lib/types"
import { useVaultPoolId, useVaultTvl } from "@/hooks"

import Skeleton from "@/components/Skeleton"

export const CompounderVaultTvl: FC<CompounderVaultProps> = (props) => {
  const poolId = useVaultPoolId(props)
  const tvl = useVaultTvl({ ...props, poolId: poolId.data })

  return (
    <Skeleton isLoading={poolId.isLoading || tvl.isLoading}>
      {formatUsd({ abbreviate: true, amount: tvl.data })}
    </Skeleton>
  )
}

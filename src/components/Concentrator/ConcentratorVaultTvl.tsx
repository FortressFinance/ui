import { FC } from "react"

import { formatUsd } from "@/lib/helpers/formatCurrency"
import { ConcentratorVaultProps } from "@/lib/types"
import { useConcentratorVaultTvl } from "@/hooks/useConcentratorVaultTvl"

import Skeleton from "@/components/Skeleton"

export const ConcentratorVaultTvl: FC<ConcentratorVaultProps> = (props) => {
  const tvl = useConcentratorVaultTvl(props)

  return (
    <Skeleton isLoading={tvl.isLoading}>
      {formatUsd({ abbreviate: true, amount: tvl.data })}
    </Skeleton>
  )
}

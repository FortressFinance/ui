import { FC } from "react"

import { formatUsd } from "@/lib/helpers/formatCurrency"
import { VaultProps } from "@/lib/types"
import { useConcentratorVaultTvl } from "@/hooks/useConcentratorVaultTvl"

import Skeleton from "@/components/Skeleton"

export const ConcentratorVaultTvl: FC<VaultProps> = (props) => {
  const tvl = useConcentratorVaultTvl(props)

  return (
    <Skeleton isLoading={tvl.isLoading}>
      {formatUsd({ abbreviate: true, amount: tvl.data })}
    </Skeleton>
  )
}

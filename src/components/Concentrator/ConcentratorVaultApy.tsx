import { FC } from "react"

import { formatPercentage } from "@/lib/helpers"
import { ConcentratorVaultProps } from "@/lib/types"
import { useConcentratorVaultApy } from "@/hooks/useConcentratorVaultApy"

import Skeleton from "@/components/Skeleton"

export const ConcentratorVaultApy: FC<ConcentratorVaultProps> = (props) => {
  const apy = useConcentratorVaultApy(props)
  return (
    <Skeleton isLoading={apy.isLoading}>{formatPercentage(apy.data)}</Skeleton>
  )
}

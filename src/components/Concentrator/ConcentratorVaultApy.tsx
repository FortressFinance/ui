import { FC } from "react"

import { formatPercentage } from "@/lib/helpers"
import { VaultProps } from "@/lib/types"
import { useConcentratorVaultApy } from "@/hooks/useConcentratorVaultApy"

import Skeleton from "@/components/Skeleton"

export const ConcentratorVaultApy: FC<VaultProps> = (props) => {
  const apy = useConcentratorVaultApy(props)
  return (
    <Skeleton isLoading={apy.isLoading}>{formatPercentage(apy.data)}</Skeleton>
  )
}

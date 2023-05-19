import { FC } from "react"

import { formatPercentage } from "@/lib/helpers"

import Skeleton from "@/components/Skeleton"

export const ManagedVaultsApy: FC = () => {
  return <Skeleton isLoading={false}>{formatPercentage(0.12)}</Skeleton>
}

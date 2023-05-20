import { FC } from "react"

import { VaultProps } from "@/lib/types"
import { useConcentratorVaultBreakdownApy } from "@/hooks/useConcentratorVaultBreakdownApy"

import { VaultStrategyModalDefinitionList } from "@/components/Modal/VaultStrategyModal"

export const ConcentratorVaultStrategyModalApr: FC<VaultProps> = (props) => {
  const breakdownApr = useConcentratorVaultBreakdownApy(props)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = breakdownApr.data as any

  // eslint-disable-next-line no-sparse-arrays
  const items = [
    {
      label: "Total APR",
      value: data?.totalApr,
      emphasis: true,
      disabledTooltip: true,
    },
    { label: "Base APR", value: data?.baseApy ?? data?.baseApr },
    { label: "CRV APR", value: data?.crvApy ?? data?.crvApr },
    { label: "CVX APR", value: data?.cvxApy ?? data?.cvxApr },
    { label: "Extra Rewards APR", value: data?.extraRewardsApr },
    { label: "BAL APR", value: data?.BALApr },
    { label: "Swap Fee APR", value: data?.swapFeeApr },
    { label: "Aura APR", value: data?.AuraApr },
    { label: "GMX APR", value: data?.GMXApr },
    { label: "ETH APR", value: data?.ETHApr },
  ]

  return (
    <VaultStrategyModalDefinitionList
      isLoading={breakdownApr.isLoading}
      items={items}
    />
  )
}

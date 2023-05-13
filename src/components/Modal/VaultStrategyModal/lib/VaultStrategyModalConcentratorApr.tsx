import { FC } from "react"

import { VaultProps } from "@/lib/types"
import { useConcentratorVaultBreakdownApy } from "@/hooks/useConcentratorVaultBreakdownApy"

import { VaultStrategyModalDefinitionList } from "@/components/Modal/VaultStrategyModal/lib/VaultStrategyModalDefinitionList"

export const VaultStrategyModalConcentratorApr: FC<VaultProps> = (props) => {
  const breakdownApr = useConcentratorVaultBreakdownApy(props)

  const items = []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = breakdownApr.data as any

  items.push({
    label: "Total APR",
    value: data?.totalApr,
    emphasis: true,
    disabledTooltip: true,
  })
  items.push({ label: "Base APR", value: data?.baseApy ?? data?.baseApr })
  items.push({ label: "CRV APR", value: data?.crvApy ?? data?.crvApr })
  items.push({ label: "CVX APR", value: data?.cvxApy ?? data?.cvxApr })
  items.push({ label: "Extra Rewards APR", value: data?.extraRewardsApr })
  items.push({ label: "BAL APR", value: data?.BALApr })
  items.push({ label: "Swap Fee APR", value: data?.swapFeeApr })
  items.push({ label: "Aura APR", value: data?.AuraApr })
  items.push({ label: "GMX APR", value: data?.GMXApr })
  items.push({ label: "ETH APR", value: data?.ETHApr })

  return (
    <VaultStrategyModalDefinitionList
      isLoading={breakdownApr.isLoading}
      items={items}
    />
  )
}

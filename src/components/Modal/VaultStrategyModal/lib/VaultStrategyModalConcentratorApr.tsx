import { FC } from "react"

import { VaultProps } from "@/lib/types"
import { useConcentratorVaultBreakdownApy } from "@/hooks/useConcentratorVaultBreakdownApy"

import { VaultStrategyModalDefinitionList } from "@/components/Modal/VaultStrategyModal/lib/VaultStrategyModalDefinitionList"

export const VaultStrategyModalConcentratorApr: FC<VaultProps> = (props) => {
  const breakdownApr = useConcentratorVaultBreakdownApy(props)

  const items = []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = breakdownApr.data as any

  if (data?.baseApr !== undefined)
    items.push({ label: "Base APR", value: data?.baseApr })
  if (data?.crvApr !== undefined)
    items.push({ label: "CRV APR", value: data?.crvApr })
  if (data?.cvxApr !== undefined)
    items.push({ label: "CVX APR", value: data?.cvxApr })
  if (data?.extraRewardsApr !== undefined)
    items.push({ label: "Extra Rewards APR", value: data?.extraRewardsApr })
  if (data?.BALApr !== undefined)
    items.push({ label: "BAL APR", value: data?.BALApr })
  if (data?.swapFeeApr !== undefined)
    items.push({ label: "Swap Fee APR", value: data?.swapFeeApr })
  if (data?.AuraApr !== undefined)
    items.push({ label: "Aura APR", value: data?.AuraApr })
  if (data?.GMXApr !== undefined)
    items.push({ label: "GMX APR", value: data?.GMXApr })
  if (data?.ETHApr !== undefined)
    items.push({ label: "ETH APR", value: data?.ETHApr })
  if (data?.totalApr !== undefined)
    items.push({ label: "Total APR", value: data?.totalApr, emphasis: true })

  return (
    <VaultStrategyModalDefinitionList
      isLoading={breakdownApr.isLoading}
      items={items}
    />
  )
}

import { FC } from "react"

import { convertToApy } from "@/lib/api/vaults/convertToApy"
import { VaultProps } from "@/lib/types"
import { useIsConcentratorCurveVault } from "@/hooks"
import { useConcentratorBreakdownApy } from "@/hooks/useConcentratorBreakdownApy"

import { VaultStrategyModalDefinitionList } from "@/components/Modal/VaultStrategyModal/lib/VaultStrategyModalDefinitionList"

export const VaultStrategyModalConcentratorRewardApr: FC<VaultProps> = (
  props
) => {
  const isCurve = useIsConcentratorCurveVault(props.asset)
  const breakdownApy = useConcentratorBreakdownApy({
    targetAsset: props.asset,
    primaryAsset: props.vaultAddress,
    type: isCurve ? "curve" : "balancer",
  })

  const items = []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = breakdownApy.data as any
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
    items.push({
      label: "Total APY",
      value: convertToApy(data?.totalApr),
      emphasis: true,
    })

  return (
    <VaultStrategyModalDefinitionList
      isLoading={breakdownApy.isLoading}
      items={items}
    />
  )
}

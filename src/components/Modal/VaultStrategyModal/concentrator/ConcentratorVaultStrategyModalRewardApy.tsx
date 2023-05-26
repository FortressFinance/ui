import { FC } from "react"

import { convertToApy } from "@/lib/api/vaults/convertToApy"
import { VaultProps } from "@/lib/types"
import { useConcentratorFirstVaultType } from "@/hooks"
import { useConcentratorBreakdownApy } from "@/hooks/useConcentratorBreakdownApy"

import { VaultStrategyModalDefinitionList } from "@/components/Modal/VaultStrategyModal"

export const ConcentratorVaultStrategyModalRewardApy: FC<VaultProps> = (
  props
) => {
  const firstConcentratorVaultType = useConcentratorFirstVaultType({
    targetAsset: props.asset,
  })
  const breakdownApy = useConcentratorBreakdownApy({
    targetAsset: props.asset,
    primaryAsset: props.vaultAddress,
    type: firstConcentratorVaultType ?? "balancer",
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = breakdownApy.data as any

  const items = [
    {
      label: "Total APY",
      value: convertToApy(data?.totalApr),
      emphasis: true,
    },
    { label: "Base APR", value: data?.baseApr },
    { label: "CRV APR", value: data?.crvApr },
    { label: "CVX APR", value: data?.cvxApr },
    { label: "Extra Rewards APR", value: data?.extraRewardsApr },
    { label: "BAL APR", value: data?.BALApr },
    { label: "Swap Fee APR", value: data?.swapFeeApr },
    { label: "Aura APR", value: data?.AuraApr },
    { label: "GMX APR", value: data?.GMXApr },
    { label: "ETH APR", value: data?.ETHApr },
  ]

  return (
    <VaultStrategyModalDefinitionList
      isLoading={breakdownApy.isLoading}
      items={items}
    />
  )
}

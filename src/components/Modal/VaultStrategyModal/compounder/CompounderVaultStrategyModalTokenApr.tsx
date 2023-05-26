import { FC } from "react"

import { VaultProps } from "@/lib/types"
import {
  useTokenVaultCrvApr,
  useTokenVaultCvxApr,
  useVaultApy,
  useVaultAuraApr,
  useVaultBalApr,
  useVaultEthApr,
  useVaultExtraApr,
  useVaultGmxApr,
  useVaultTotalApr,
} from "@/hooks"

import { VaultStrategyModalDefinitionList } from "@/components/Modal/VaultStrategyModal"

export const CompounderVaultStrategyModalTokenApr: FC<VaultProps> = (props) => {
  const totalApy = useVaultApy(props)
  const totalApr = useVaultTotalApr(props)
  const balApr = useVaultBalApr(props)
  const auraApr = useVaultAuraApr(props)
  const crvApr = useTokenVaultCrvApr(props)
  const cvxApr = useTokenVaultCvxApr(props)
  const gmxApr = useVaultGmxApr(props)
  const ethApr = useVaultEthApr(props)
  const extraRewardsApr = useVaultExtraApr(props)

  return (
    <VaultStrategyModalDefinitionList
      isLoading={[
        totalApy,
        totalApr,
        balApr,
        auraApr,
        crvApr,
        cvxApr,
        gmxApr,
        ethApr,
        extraRewardsApr,
      ].some((q) => q.isLoading)}
      items={[
        { label: "Total APY", value: totalApy.data, emphasis: true },
        { label: "BAL APR", value: balApr.data },
        { label: "AURA APR", value: auraApr.data },
        { label: "CRV APR", value: crvApr.data },
        { label: "CVX APR", value: cvxApr.data },
        { label: "GMX APR", value: gmxApr.data },
        { label: "ETH APR", value: ethApr.data },
        { label: "Extra Rewards APR", value: extraRewardsApr.data },
        { label: "Total APR", value: totalApr.data },
      ]}
    />
  )
}

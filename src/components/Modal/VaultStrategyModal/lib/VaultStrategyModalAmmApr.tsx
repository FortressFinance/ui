import { FC } from "react"

import { VaultProps } from "@/lib/types"
import {
  useVaultApy,
  useVaultBaseApr,
  useVaultCrvApr,
  useVaultCvxApr,
  useVaultExtraApr,
  useVaultTotalApr,
} from "@/hooks"

import { VaultStrategyModalDefinitionList } from "@/components/Modal/VaultStrategyModal/lib/VaultStrategyModalDefinitionList"

export const VaultStrategyModalAmmApr: FC<VaultProps> = (props) => {
  const totalApy = useVaultApy(props)
  const totalApr = useVaultTotalApr(props)
  const baseApr = useVaultBaseApr(props)
  const crvApr = useVaultCrvApr(props)
  const cvxApr = useVaultCvxApr(props)
  const extraRewardsApr = useVaultExtraApr(props)

  return (
    <VaultStrategyModalDefinitionList
      isLoading={[
        totalApy,
        totalApr,
        baseApr,
        crvApr,
        cvxApr,
        extraRewardsApr,
      ].some((q) => q.isLoading)}
      items={[
        { label: "Total APY", value: totalApy.data, emphasis: true },
        { label: "Base APR", value: baseApr.data },
        { label: "CRV APR", value: crvApr.data },
        { label: "CVX APR", value: cvxApr.data },
        { label: "Extra Rewards APR", value: extraRewardsApr.data },
        { label: "Total APR", value: totalApr.data },
      ]}
    />
  )
}

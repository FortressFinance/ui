import { FC } from "react"

import { CompounderVaultProps } from "@/lib/types"
import {
  useVaultApy,
  useVaultBaseApr,
  useVaultCrvApr,
  useVaultCvxApr,
  useVaultExtraApr,
  useVaultPoolId,
  useVaultTotalApr,
} from "@/hooks"

import { VaultStrategyModalDefinitionList } from "@/components/Modal/VaultStrategyModal/lib/VaultStrategyModalDefinitionList"

export const VaultStrategyModalAmmApr: FC<CompounderVaultProps> = (props) => {
  const { data: poolId, ...poolIdQuery } = useVaultPoolId(props)
  const totalApy = useVaultApy({ ...props, poolId })
  const totalApr = useVaultTotalApr({ ...props, poolId })
  const baseApr = useVaultBaseApr({ ...props, poolId })
  const crvApr = useVaultCrvApr({ ...props, poolId })
  const cvxApr = useVaultCvxApr({ ...props, poolId })
  const extraRewardsApr = useVaultExtraApr({ ...props, poolId })

  return (
    <VaultStrategyModalDefinitionList
      isLoading={[
        poolIdQuery,
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

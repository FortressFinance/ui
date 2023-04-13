import { FC } from "react"

import { CompounderVaultProps } from "@/lib/types"
import {
  useVaultApy,
  useVaultAuraApr,
  useVaultBalApr,
  useVaultCrvApr,
  useVaultCvxApr,
  useVaultEthApr,
  useVaultExtraApr,
  useVaultGmxApr,
  useVaultPoolId,
  useVaultTotalApr,
} from "@/hooks"

import { VaultStrategyModalDefinitionList } from "@/components/Modal/VaultStrategyModal/lib/VaultStrategyModalDefinitionList"

export const VaultStrategyModalTokenApr: FC<CompounderVaultProps> = (props) => {
  const { data: poolId, ...poolIdQuery } = useVaultPoolId(props)
  const totalApy = useVaultApy({ ...props, poolId })
  const totalApr = useVaultTotalApr({ ...props, poolId })
  const balApr = useVaultBalApr({ ...props, poolId })
  const auraApr = useVaultAuraApr({ ...props, poolId })
  const crvApr = useVaultCrvApr({ ...props, poolId })
  const cvxApr = useVaultCvxApr({ ...props, poolId })
  const gmxApr = useVaultGmxApr({ ...props, poolId })
  const ethApr = useVaultEthApr({ ...props, poolId })
  const extraRewardsApr = useVaultExtraApr({ ...props, poolId })

  return (
    <VaultStrategyModalDefinitionList
      isLoading={[
        poolIdQuery,
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

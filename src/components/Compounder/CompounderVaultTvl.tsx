import { FC } from "react"

import clsxm from "@/lib/clsxm"
import { formatCurrencyUnits, formatUsd } from "@/lib/helpers/formatCurrency"
import { VaultProps } from "@/lib/types"
import { useVaultPoolId, useVaultTvl } from "@/hooks"

import Skeleton from "@/components/Skeleton"

export const CompounderVaultTvl: FC<VaultProps> = (props) => {
  const poolId = useVaultPoolId({ ...props, enabled: true })
  const tvlData = useVaultTvl({ ...props, poolId: poolId.data })
  const data = tvlData.data

  return (
    <div className={clsxm("lg:grid", { "lg:grid-rows-2": !!data })}>
      <div className="max-lg:hidden">
        <Skeleton isLoading={poolId.isLoading || tvlData.isLoading}>
          {formatCurrencyUnits({
            amountWei: data.tvl,
            maximumFractionDigits: 2,
          })}
        </Skeleton>
      </div>
      {data.usdTvl && (
        <div className="text-xs max-lg:text-sm">
          <Skeleton isLoading={poolId.isLoading || tvlData.isLoading}>
            {formatUsd({ abbreviate: true, amount: data.usdTvl })}
          </Skeleton>
        </div>
      )}
    </div>
  )
}

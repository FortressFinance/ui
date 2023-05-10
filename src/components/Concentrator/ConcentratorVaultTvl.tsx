import { FC } from "react"

import clsxm from "@/lib/clsxm"
import { formatCurrencyUnits, formatUsd } from "@/lib/helpers/formatCurrency"
import { VaultProps } from "@/lib/types"
import { useConcentratorVaultTvl } from "@/hooks/useConcentratorVaultTvl"

import Skeleton from "@/components/Skeleton"

export const ConcentratorVaultTvl: FC<VaultProps> = (props) => {
  const tvlData = useConcentratorVaultTvl(props)
  const data = tvlData.data

  return (
    <div className={clsxm("lg:grid", { "lg:grid-rows-2": !!data })}>
      <div className="max-lg:hidden">
        <Skeleton isLoading={tvlData.isLoading}>
          {formatCurrencyUnits({ abbreviate: true, amountWei: data.tvl })}
        </Skeleton>
      </div>
      {data.usdTvl && (
        <div className="text-xs max-lg:text-base">
          <Skeleton isLoading={tvlData.isLoading}>
            {formatUsd({ abbreviate: true, amount: data.usdTvl })}
          </Skeleton>
        </div>
      )}
    </div>
  )
}

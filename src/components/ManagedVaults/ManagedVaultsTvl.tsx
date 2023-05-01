import { FC } from "react"

import clsxm from "@/lib/clsxm"
import { formatCurrencyUnits, formatUsd } from "@/lib/helpers/formatCurrency"

import Skeleton from "@/components/Skeleton"

export const ManagedVaultsTvl: FC = () => {
  const data = {
    tvl: "0",
    usdTvl: 0,
  }

  return (
    <div className={clsxm("lg:grid", { "lg:grid-rows-2": !!data })}>
      <div>
        <Skeleton isLoading={false}>
          {formatCurrencyUnits({ abbreviate: true, amountWei: data.tvl })}
        </Skeleton>
      </div>
      {data.usdTvl && (
        <div className="text-xs max-lg:hidden">
          <Skeleton isLoading={false}>
            {formatUsd({ abbreviate: true, amount: data.usdTvl })}
          </Skeleton>
        </div>
      )}
    </div>
  )
}

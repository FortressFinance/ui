import { FC } from "react"

import clsxm from "@/lib/clsxm"
import { formatCurrencyUnits, formatUsd } from "@/lib/helpers/formatCurrency"

import Skeleton from "@/components/Skeleton"

export const ManagedVaultsTvl: FC = () => {
  const data = {
    tvl: "210000000000000000000",
    usdTvl: 31000,
  }

  return (
    <div className={clsxm("lg:grid", { "lg:grid-rows-2": !!data })}>
      <div>
        <Skeleton isLoading={false}>
          {formatCurrencyUnits({
            amountWei: data.tvl,
            maximumFractionDigits: 2,
          })}
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

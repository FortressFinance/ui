import { FC } from "react"
import { useAccount } from "wagmi"

import { formatCurrencyUnits, formatUsd } from "@/lib/helpers/formatCurrency"
import { CompounderVaultProps } from "@/lib/types"
import { useTokenOrNative, useVaultPoolId, useVaultUserEarnings } from "@/hooks"

import Skeleton from "@/components/Skeleton"

export const VaultUserEarnings: FC<CompounderVaultProps> = (props) => {
  const poolId = useVaultPoolId(props)
  const earnings = useVaultUserEarnings({
    poolId: poolId.data,
    type: props.type,
  })
  const token = useTokenOrNative({ address: props.asset })
  const { isConnected } = useAccount()
  const isLoading = poolId.isLoading || earnings.isLoading

  return isConnected ? (
    <div className="lg:grid lg:grid-rows-2">
      <div>
        <Skeleton isLoading={isLoading}>
          {formatCurrencyUnits({
            abbreviate: true,
            amountWei: earnings.data.earned,
            decimals: token.data?.decimals,
          })}
        </Skeleton>
      </div>
      <div className="text-xs max-lg:hidden">
        <Skeleton isLoading={isLoading}>
          {formatUsd({ abbreviate: true, amount: earnings.data.earnedUSD })}
        </Skeleton>
      </div>
    </div>
  ) : (
    <div>—</div>
  )
}

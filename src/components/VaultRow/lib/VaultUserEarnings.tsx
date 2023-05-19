import { FC } from "react"
import { formatUnits } from "viem"
import { useAccount } from "wagmi"

import { formatCurrencyUnits, formatUsd } from "@/lib/helpers/formatCurrency"
import { VaultProps } from "@/lib/types"
import {
  useTokenOrNative,
  useTokenPriceUsd,
  useVaultPoolId,
  useVaultUserEarnings,
} from "@/hooks"

import Skeleton from "@/components/Skeleton"

export const VaultUserEarnings: FC<VaultProps> = (props) => {
  const poolId = useVaultPoolId(props)
  const earnings = useVaultUserEarnings({
    poolId: poolId.data,
    type: props.type,
  })
  const token = useTokenOrNative({ address: props.asset })
  const { isConnected } = useAccount()
  const isLoading = poolId.isLoading || earnings.isLoading
  const { data: tokenPriceUsd, isLoading: isLoadingTokenPriceUsd } =
    useTokenPriceUsd({ asset: props.asset })

  const earnedFormatted = formatUnits(
    BigInt(earnings.data?.earned ?? "0"),
    token.data?.decimals ?? 18
  )
  const earnedUSD =
    !!earnings.data.earnedUSD || earnings.data.earnedUSD == 0
      ? Number(earnedFormatted ?? "0") * (tokenPriceUsd ?? 0)
      : earnings.data.earnedUSD

  return isConnected ? (
    <div className="lg:grid lg:grid-rows-2">
      <div className="max-lg:hidden">
        <Skeleton isLoading={isLoading || isLoadingTokenPriceUsd}>
          {formatCurrencyUnits({
            amountWei: earnings.data.earned,
            decimals: token.data?.decimals,
            maximumFractionDigits: 2,
          })}
        </Skeleton>
      </div>
      <div className="text-xs max-lg:text-sm">
        <Skeleton isLoading={isLoading || isLoadingTokenPriceUsd}>
          {formatUsd({
            abbreviate: true,
            amount: earnedUSD,
          })}
        </Skeleton>
      </div>
    </div>
  ) : (
    <div>—</div>
  )
}

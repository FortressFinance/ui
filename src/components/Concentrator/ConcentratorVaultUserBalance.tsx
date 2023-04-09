import { FC } from "react"

import clsxm from "@/lib/clsxm"
import { ConcentratorVaultProps } from "@/lib/types"
import { useTokenOrNativeBalance } from "@/hooks"
import { useConcentratorTokenPriceUsd } from "@/hooks/useConcentratorTokenPriceUsd"

import { AssetBalance, AssetBalanceUsd } from "@/components/Asset"

export const ConcentratorVaultUserBalance: FC<ConcentratorVaultProps> = (
  props
) => {
  const { data: balance } = useTokenOrNativeBalance({
    address: props.targetAsset,
  })
  const tokenPriceUsd = useConcentratorTokenPriceUsd({
    asset: props.targetAsset,
  })

  return (
    <div className={clsxm("lg:grid", { "lg:grid-rows-2": !!balance })}>
      <div>
        <AssetBalance address={props.targetAsset} abbreviate />
      </div>
      {balance && (
        <div className="text-xs max-lg:hidden">
          <AssetBalanceUsd
            tokenPriceUsd={tokenPriceUsd}
            address={props.targetAsset}
            abbreviate
          />
        </div>
      )}
    </div>
  )
}

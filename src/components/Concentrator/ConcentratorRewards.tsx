import { FC } from "react"
import { Address } from "wagmi"

import { FilterCategory } from "@/lib/types"
import {
  useConcentratorAddress,
  useFilteredConcentratorVaults,
} from "@/hooks/data/concentrators"

import { AssetLogo, AssetSymbol } from "@/components/Asset"
import Button from "@/components/Button"

type ConcentratorRewardsProps = {
  concentratorTargetAsset: Address
  filterCategory: FilterCategory
}

export const ConcentratorRewards: FC<ConcentratorRewardsProps> = ({
  concentratorTargetAsset,
  filterCategory,
}) => {
  // this is pretty convoluted...
  // get the vaults relevant to this concentrator
  const vaultsForThisConcentrator = useFilteredConcentratorVaults({
    concentratorTargetAsset,
    filterCategory,
  })
  // take the first one, because they all have the same vaultAssetAddress
  const firstVaultForThisConcentrator = vaultsForThisConcentrator.data?.[0]
  // use the vaultAssetAddress to get the concentrator address
  // TODO: use concentratorAddress to interact with concentrator contract
  const _concentratorAddress = useConcentratorAddress({
    concentratorTargetAsset,
    vaultAssetAddress: firstVaultForThisConcentrator?.vaultAssetAddress,
    vaultType: firstVaultForThisConcentrator?.vaultType,
  })

  return (
    <div className="divide-y divide-pink/30 rounded-md bg-pink-900/80 px-4 backdrop-blur-md">
      <div className="grid grid-cols-[auto,1fr,auto] items-center gap-2 py-4">
        <div className="relative h-9 w-9 rounded-full bg-white">
          <AssetLogo name="token" tokenAddress={concentratorTargetAsset} />
          {/* TODO: Need logos for target assets */}
          {/* Should we have those hardcoded? Should we get them by address? How to get address? */}
          {/* <AssetLogo name={concentratorTargetAsset} className="h-6 w-6" /> */}
        </div>
        <div>
          <h1 className="text-sm">Concentrator</h1>
          <h2 className="font-semibold">
            <span className="bg-gradient-to-r from-orange to-pink bg-clip-text text-transparent">
              <AssetSymbol assetAddress={concentratorTargetAsset} />
            </span>
          </h2>
        </div>
        <div>
          <dl className="text-right">
            <dt className="text-sm">APY</dt>
            <dd className="font-semibold">
              <span className="bg-gradient-to-r from-orange to-pink bg-clip-text text-transparent">
                23.35%
              </span>
            </dd>
          </dl>
        </div>
      </div>
      <div className="py-4">
        <dl className="grid grid-cols-[1fr,auto] gap-y-2">
          <dt className="text-xs font-medium text-white/80">AUM</dt>
          <dd className="text-right text-xs font-medium text-white/80">
            $3,067,000
          </dd>
          <dt className="text-xs font-medium text-white/80">Balance</dt>
          <dd className="text-right text-xs font-medium text-white/80">
            132 <AssetSymbol assetAddress={concentratorTargetAsset} />
          </dd>
          <dt className="text-sm font-semibold leading-relaxed">
            <span className="bg-gradient-to-r from-orange to-pink bg-clip-text text-transparent">
              Rewards
            </span>
          </dt>
          <dd className="text-right text-sm font-bold leading-relaxed">
            121 <AssetSymbol assetAddress={concentratorTargetAsset} />
          </dd>
        </dl>

        <Button className="mt-4 w-full py-2">Claim</Button>
      </div>
    </div>
  )
}

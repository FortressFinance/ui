import { FC, Fragment } from "react"

import { VaultProps } from "@/lib/types"
import { useIsTokenVault, useVault } from "@/hooks"

import { AssetSymbol } from "@/components/Asset"

export const VaultStrategyText: FC<VaultProps> = ({
  asset,
  type,
  vaultAddress,
}) => {
  const isToken = useIsTokenVault(type)
  const vault = useVault({ asset, type, vaultAddress })
  const underlyingAssets = vault.data?.underlyingAssets
  return (
    <>
      {isToken ? (
        // THE TEXT HERE WAS WRITTEN FOR THE GLP COUMPOUNDER
        <div className="space-y-3 leading-relaxed">
          <p>
            This vault accepts deposits in form of its primary asset{" "}
            <AssetSymbol address={asset} /> and any of its underlying assets
            mentioned below, all of which will be converted to staked{" "}
            <AssetSymbol address={asset} /> automatically.
          </p>
          <p>
            Deposited assets are used to provide liquidity for GMX traders,
            earning trading fees plus GMX emissions on its staked{" "}
            <AssetSymbol address={asset} />
          </p>
          <p>
            The vault auto-compounds the accumulated rewards periodically into
            more staked <AssetSymbol address={asset} />
          </p>
          <p>
            Investors receive vault shares as ERC20 tokens called{" "}
            <AssetSymbol address={vaultAddress} />, representing their pro-rata
            share of the compounding funds.{" "}
          </p>
          <p>
            Investors can use <AssetSymbol address={vaultAddress} /> in other
            Fortress products or integrated protocols.{" "}
          </p>
          <p>
            The staked <AssetSymbol address={asset} /> contains the following
            basket of assets:{" "}
            {underlyingAssets?.map((address, index) => (
              <Fragment key={`underlying-asset-${index}`}>
                {underlyingAssets.length > 2 &&
                index > 0 &&
                index !== underlyingAssets.length - 1
                  ? ", "
                  : index > 0
                  ? " and "
                  : null}
                <AssetSymbol key={`token-symbol-${index}`} address={address} />
              </Fragment>
            ))}
            .
          </p>
        </div>
      ) : (
        <p>
          This token represents a {type === "curve" ? "Curve" : "Balancer"}{" "}
          liquidity pool. Holders earn fees from users trading in the pool, and
          can also deposit the LP to Curve's gauges to earn CRV emissions. This
          Curve v2 crypto pool contains{" "}
          {underlyingAssets?.map((address, index) => (
            <Fragment key={`underlying-asset-${index}`}>
              {underlyingAssets.length > 2 &&
              index > 0 &&
              index !== underlyingAssets.length - 1
                ? ", "
                : index > 0
                ? " and "
                : null}
              <AssetSymbol key={`token-symbol-${index}`} address={address} />
            </Fragment>
          ))}
          .
        </p>
      )}
    </>
  )
}

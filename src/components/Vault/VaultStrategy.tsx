import Link from "next/link"
import { FC, Fragment, MouseEventHandler } from "react"
import { useAccount } from "wagmi"

import { VaultProps } from "@/lib/types"
import { useVault, useVaultFees } from "@/hooks/data/vaults"
import useTokenOrNative from "@/hooks/useTokenOrNative"
import { useIsTokenCompounder } from "@/hooks/useVaultTypes"

import { AssetSymbol } from "@/components/Asset"
import { ModalBaseProps } from "@/components/Modal/ModalBase"
import PurpleModal, {
  PurpleModalContent,
  PurpleModalHeader,
} from "@/components/Modal/PurpleModal"
import Percentage from "@/components/Percentage"
import Skeleton from "@/components/Skeleton"
import Tooltip from "@/components/Tooltip"
import { CurveBalancerApr } from "@/components/Vault/APR/CurveBalancerApr"
import { TokenApr } from "@/components/Vault/APR/TokenApr"

import {
  FortIconAddToWallet,
  FortIconClose,
  FortIconExternalLink,
} from "@/icons"

const VaultStrategyModal: FC<VaultProps & ModalBaseProps> = ({
  isOpen,
  onClose,
  ...vaultProps
}) => {
  const { connector } = useAccount()
  const fees = useVaultFees(vaultProps)

  const { data: ybToken } = useTokenOrNative({
    address: vaultProps.vaultAddress,
  })
  const isToken = useIsTokenCompounder(vaultProps.type)

  const addTokenToWallet: MouseEventHandler<HTMLButtonElement> = () => {
    if (ybToken && ybToken.address && connector && connector.watchAsset) {
      connector.watchAsset(ybToken)
    }
  }
  const label = `Add ${ybToken?.symbol} to wallet`

  return (
    <PurpleModal
      className="max-xl:max-w-4xl xl:max-w-5xl"
      isOpen={isOpen}
      onClose={onClose}
    >
      <PurpleModalHeader className="flex justify-between space-x-4">
        <div className="flex space-x-4">
          {!!connector && !!connector.watchAsset && (
            <Tooltip label={label}>
              <button onClick={addTokenToWallet}>
                <FortIconAddToWallet
                  className="h-6 w-6 fill-white"
                  aria-label={label}
                />
              </button>
            </Tooltip>
          )}
          <Tooltip label="View contract">
            <Link
              className="h-6 w-6 p-[1px]"
              href={`https://arbiscan.io/address/${vaultProps.vaultAddress}`}
              target="_blank"
            >
              <FortIconExternalLink className="h-full w-full" />
              <span className="sr-only">View contract</span>
            </Link>
          </Tooltip>
        </div>
        <button className="h-6 w-6 p-[1px]" onClick={onClose}>
          <FortIconClose className="h-full w-full fill-white" />
          <span className="sr-only">Close</span>
        </button>
      </PurpleModalHeader>

      <PurpleModalContent className="grid grid-cols-1 divide-pink-800 p-0 md:grid-cols-[3fr,2fr] md:divide-x md:p-0 lg:grid-cols-[2fr,1fr]">
        {/* Vault description */}
        <div className="max-md:row-start-2">
          <h1 className="border-b border-pink-800 p-3 text-xs font-semibold uppercase text-pink-300 max-md:border-t max-md:text-center md:px-5">
            Vault description
          </h1>

          <div className="flex-col space-y-5 p-4 pb-5 text-pink-50 max-md:divide-y max-md:divide-pink-700 max-md:text-sm md:px-5">
            <VaultStrategyText {...vaultProps} />
          </div>
        </div>

        {/* APR */}
        <div className="sm:grid sm:grid-cols-2 sm:divide-x sm:divide-pink-800 md:block md:divide-x-0">
          <div>
            <h1 className="border-b border-pink-800 p-3 text-xs font-semibold uppercase text-pink-300 max-md:text-center md:px-5">
              APR
            </h1>
            <dl className="grid grid-cols-[max-content,auto] gap-2 p-4 pb-5 text-sm text-pink-50 md:px-5">
              {isToken ? (
                <TokenApr {...vaultProps} />
              ) : (
                <CurveBalancerApr {...vaultProps} />
              )}
            </dl>
          </div>

          {/* Fees */}
          <div>
            <h1 className="border-b border-pink-800 p-3 text-xs font-semibold uppercase text-pink-300 max-md:text-center max-sm:border-t md:border-t md:px-5">
              Fortress fees
            </h1>
            <dl className="grid grid-cols-[max-content,auto] gap-2 p-4 pb-5 text-sm text-pink-50 md:px-5">
              <dt>Deposit</dt>
              <dd className="text-right">
                <Skeleton isLoading={fees.isLoading}>
                  <Percentage truncate>
                    {fees.data?.depositFee ?? "0"}
                  </Percentage>
                </Skeleton>
              </dd>
              <dt>Withdrawal</dt>
              <dd className="text-right">
                <Skeleton isLoading={fees.isLoading}>
                  <Percentage truncate>
                    {fees.data?.withdrawFee ?? "0"}
                  </Percentage>
                </Skeleton>
              </dd>
              <dt>Management</dt>
              <dd className="text-right">
                <Skeleton isLoading={fees.isLoading}>
                  <Percentage truncate>
                    {fees.data?.platformFee ?? "0"}
                  </Percentage>
                </Skeleton>
              </dd>
              <dt>Performance</dt>
              <dd className="text-right">
                <Skeleton isLoading={fees.isLoading}>
                  <Percentage truncate>
                    {fees.data?.performanceFee ?? "0"}
                  </Percentage>
                </Skeleton>
              </dd>
            </dl>
          </div>
        </div>
      </PurpleModalContent>
    </PurpleModal>
  )
}

export default VaultStrategyModal

const VaultStrategyText: FC<VaultProps> = ({ asset, type, vaultAddress }) => {
  const isToken = useIsTokenCompounder(type)
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

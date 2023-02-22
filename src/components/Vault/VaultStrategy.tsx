import { Dialog } from "@headlessui/react"
import Link from "next/link"
import { FC, Fragment, MouseEventHandler, useState } from "react"
import { useAccount } from "wagmi"

import { VaultProps } from "@/lib/types"
import { useVault, useVaultFees } from "@/hooks/data/vaults"
import useTokenOrNative from "@/hooks/useTokenOrNative"
import { useIsTokenCompounder } from "@/hooks/useVaultTypes"

import { AssetSymbol } from "@/components/Asset"
import Button from "@/components/Button"
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

import AddToWallet from "~/svg/icons/add-to-wallet.svg"
import Close from "~/svg/icons/close.svg"
import ExternalLink from "~/svg/icons/external-link.svg"

const VaultStrategyButton: FC<VaultProps> = (props) => {
  const [isStrategyOpen, setIsStrategyOpen] = useState(false)

  const toggleStrategyOpen: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsStrategyOpen(true)
  }

  return (
    <>
      <Button
        className="pointer-events-auto hidden transition-all duration-150 active:translate-y-0 enabled:hover:-translate-y-1 enabled:hover:shadow-button-glow enabled:hover:contrast-150 md:inline-grid"
        size="small"
        onClick={toggleStrategyOpen}
      >
        Strategy
      </Button>
      <VaultStrategyModal
        isOpen={isStrategyOpen}
        onClose={() => setIsStrategyOpen(false)}
        {...props}
      />
    </>
  )
}

export default VaultStrategyButton

type VaultStrategyModalProps = VaultProps & ModalBaseProps

const VaultStrategyModal: FC<VaultStrategyModalProps> = ({
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
              <button className="h-6 w-6" onClick={addTokenToWallet}>
                <AddToWallet className="h-6 w-6" aria-label={label} />
              </button>
            </Tooltip>
          )}
          <Tooltip label="View contract">
            <Link
              href={`https://arbiscan.io/address/${vaultProps.asset}`}
              target="_blank"
            >
              <ExternalLink className="h-6 w-6" aria-label="View contract" />
            </Link>
          </Tooltip>
        </div>
        <button className="h-6 w-6" onClick={onClose}>
          <Close className="h-6 w-6" aria-label="Close" />
        </button>
      </PurpleModalHeader>
      <PurpleModalContent className="text-xs max-md:flex-col max-md:space-y-5 max-md:divide-y max-md:divide-pink-700 md:grid md:grid-cols-2 md:gap-x-12 xl:text-base">
        {/* Left */}
        <div className="flex-col space-y-5 max-md:divide-y max-md:divide-pink-700">
          <div>
            <Dialog.Title as="h1" className="mb-4 font-bold">
              Vault description
            </Dialog.Title>
            <VaultStrategyText {...vaultProps} />
          </div>
          <div>
            <h1 className="mb-4 font-bold max-md:mt-4">APR</h1>
            <dl className="gap-x06 grid grid-cols-4 gap-y-3 gap-x-6">
              {isToken ? (
                <TokenApr {...vaultProps} />
              ) : (
                <CurveBalancerApr {...vaultProps} />
              )}
            </dl>
          </div>
        </div>

        {/* Right */}
        <div>
          <h1 className="mb-4 font-bold max-md:mt-4">Yearn fees</h1>
          <dl className="grid grid-cols-3 grid-rows-[auto,1fr] gap-x-6 gap-y-3">
            <dt className="text-sm">
              Deposit <br />
              fee
            </dt>
            <dd className="col-start-1 row-start-2 text-4xl font-semibold">
              <Skeleton isLoading={fees.isLoading}>
                <Percentage truncate>{fees.data.depositFee ?? "0"}</Percentage>
              </Skeleton>
            </dd>
            <dt className="text-sm">
              Withdrawal <br />
              fee
            </dt>
            <dd className="col-start-2 row-start-2 text-4xl font-semibold">
              <Skeleton isLoading={fees.isLoading}>
                <Percentage truncate>{fees.data.withdrawFee ?? "0"}</Percentage>
              </Skeleton>
            </dd>
            <dt className="text-sm">
              Management
              <br />
              fee
            </dt>
            <dd className="col-start-3 row-start-2 text-4xl font-semibold">
              <Skeleton isLoading={fees.isLoading}>
                <Percentage truncate>{fees.data.platformFee ?? "0"}</Percentage>
              </Skeleton>
            </dd>
            <dt className="text-sm">
              Performance
              <br />
              fee
            </dt>
            <dd className="col-start-4 row-start-2 text-4xl font-semibold">
              <Skeleton isLoading={fees.isLoading}>
                <Percentage truncate>
                  {fees.data.performanceFee ?? "0"}
                </Percentage>
              </Skeleton>
            </dd>
          </dl>
        </div>
      </PurpleModalContent>
    </PurpleModal>
  )
}

const VaultStrategyText: FC<VaultProps> = ({ asset, type, vaultAddress }) => {
  const isToken = useIsTokenCompounder(type)
  const vault = useVault({ asset, type, vaultAddress })
  const underlyingAssets = vault.data?.underlyingAssets
  return (
    <>
      {isToken ? (
        // THE TEXT HERE WAS WRITTEN FOR THE GLP COUMPOUNDER
        <div className="masked-overflow max-h-32 overflow-y-auto">
          <p className="text-justify leading-loose">
            This vault accepts deposits in form of its primary asset{" "}
            <AssetSymbol address={asset} /> and any of its underlying assets
            mentioned below, all of which will be converted to staked{" "}
            <AssetSymbol address={asset} /> automatically.
          </p>
          <p className="text-justify leading-loose">
            Deposited assets are used to provide liquidity for GMX traders,
            earning trading fees plus GMX emissions on its staked{" "}
            <AssetSymbol address={asset} />
          </p>
          <p className="text-justify leading-loose">
            The vault auto-compounds the accumulated rewards periodically into
            more staked <AssetSymbol address={asset} />
          </p>
          <p className="text-justify leading-loose">
            Investors receive vault shares as ERC20 tokens called{" "}
            <AssetSymbol address={vaultAddress} />, representing their pro-rata
            share of the compounding funds.{" "}
          </p>
          <p className="text-justify leading-loose">
            Investors can use <AssetSymbol address={vaultAddress} /> in other
            Fortress products or integrated protocols.{" "}
          </p>
          <p className="text-justify leading-loose">
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
        <p className="leading-loose">
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

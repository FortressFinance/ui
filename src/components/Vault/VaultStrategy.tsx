import { Dialog } from "@headlessui/react"
import Link from "next/link"
import { FC, Fragment, MouseEventHandler, useState } from "react"
import { Address, useAccount } from "wagmi"

import { VaultProps, VaultType } from "@/lib/types"
import {
  useVaultPlatformFee,
  useVaultTokens,
  useVaultWithdrawFee,
} from "@/hooks/data"
import { UseVaultTokensResult } from "@/hooks/data/useVaultTokens"
import useTokenOrNative from "@/hooks/useTokenOrNative"
import { useIsTokenCompounder } from "@/hooks/useVaultTypes"

import Button from "@/components/Button"
import { ModalBaseProps } from "@/components/Modal/ModalBase"
import PurpleModal, {
  PurpleModalContent,
  PurpleModalHeader,
} from "@/components/Modal/PurpleModal"
import Percentage from "@/components/Percentage"
import TokenSymbol from "@/components/TokenSymbol"
import Tooltip from "@/components/Tooltip"
import { CurveBalancerApr } from "@/components/Vault/APR/CurveBalancerApr"
import { TokenApr } from "@/components/Vault/APR/TokenApr"

import AddToWallet from "~/svg/icons/add-to-wallet.svg"
import Close from "~/svg/icons/close.svg"
import ExternalLink from "~/svg/icons/external-link.svg"

const VaultStrategyButton: FC<VaultProps> = (props) => {
  const [isStrategyOpen, setIsStrategyOpen] = useState(false)

  const { data: vaultTokens, ...vaultTokensQuery } = useVaultTokens(props)
  const { data: platformFeePercentage, ...platformFeeQuery } =
    useVaultPlatformFee(props)
  const { data: withdrawFeePercentage, ...withdrawFeeQuery } =
    useVaultWithdrawFee(props)
  const depositFeePercentage = 0 // HARDCODED IT TO ZERO FOR NOW

  const isLoading = [platformFeeQuery, withdrawFeeQuery, vaultTokensQuery].some(
    (q) => q.isLoading
  )

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
        isLoading={isLoading}
        onClick={toggleStrategyOpen}
      >
        Stategy
      </Button>
      <VaultStrategyModal
        isOpen={isStrategyOpen}
        onClose={() => setIsStrategyOpen(false)}
        underlyingAssets={vaultTokens.underlyingAssetAddresses}
        platformFeePercentage={platformFeePercentage}
        withdrawFeePercentage={withdrawFeePercentage}
        depositFeePercentage={depositFeePercentage}
        {...props}
      />
    </>
  )
}

export default VaultStrategyButton

type VaultStrategyModalProps = VaultProps &
  ModalBaseProps & {
    underlyingAssets: UseVaultTokensResult["data"]["underlyingAssetAddresses"]
    platformFeePercentage: string | number | undefined
    withdrawFeePercentage: string | number | undefined
    depositFeePercentage: string | number | undefined
  }

const VaultStrategyModal: FC<VaultStrategyModalProps> = ({
  asset,
  type,
  underlyingAssets,
  platformFeePercentage,
  withdrawFeePercentage,
  depositFeePercentage,
  ...modalProps
}) => {
  const { connector } = useAccount()

  const { data: token } = useTokenOrNative({ address: asset })
  const isToken = useIsTokenCompounder(type)

  const addTokenToWallet: MouseEventHandler<HTMLButtonElement> = () => {
    if (token && token.address && connector && connector.watchAsset) {
      connector.watchAsset(token)
    }
  }

  return (
    <PurpleModal className="max-xl:max-w-4xl xl:max-w-5xl" {...modalProps}>
      <PurpleModalHeader className="flex justify-between space-x-4">
        <div className="flex space-x-4">
          {!!connector && !!connector.watchAsset && (
            <Tooltip label="Add token to wallet">
              <button className="h-6 w-6" onClick={addTokenToWallet}>
                <AddToWallet
                  className="h-6 w-6"
                  aria-label="Add token to wallet"
                />
              </button>
            </Tooltip>
          )}
          <Tooltip label="View contract">
            <Link href={`https://arbiscan.io/address/${asset}`} target="_blank">
              <ExternalLink className="h-6 w-6" aria-label="View contract" />
            </Link>
          </Tooltip>
        </div>
        <button className="h-6 w-6" onClick={modalProps.onClose}>
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
            <VaultStrategyText type={type} underlyingAssets={underlyingAssets} asset={asset} />
          </div>
          <div>
            <h1 className="mb-4 font-bold max-md:mt-4">APR</h1>
            <dl className="gap-x06 grid grid-cols-4 gap-y-3 gap-x-6">
              {isToken ? (
                <TokenApr asset={asset} type={type} />
              ) : (
                <CurveBalancerApr asset={asset} type={type} />
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
              <Percentage truncate>{depositFeePercentage ?? 0}</Percentage>
            </dd>
            <dt className="text-sm">
              Withdrawal <br />
              fee
            </dt>
            <dd className="col-start-2 row-start-2 text-4xl font-semibold">
              <Percentage truncate>{withdrawFeePercentage ?? 0}</Percentage>
            </dd>
            <dt className="text-sm">
              Management
              <br />
              fee
            </dt>
            <dd className="col-start-3 row-start-2 text-4xl font-semibold">
              <Percentage truncate>{platformFeePercentage ?? 0}</Percentage>
            </dd>
            <dt className="text-sm">
              Performance
              <br />
              fee
            </dt>
            <dd className="col-start-4 row-start-2 text-4xl font-semibold">
              <Percentage truncate>0</Percentage>
            </dd>
          </dl>
        </div>
      </PurpleModalContent>
    </PurpleModal>
  )
}

type VaultStrategyTextProps = {
  type: VaultType
  underlyingAssets: UseVaultTokensResult["data"]["underlyingAssetAddresses"]
  asset: Address | undefined
}

const VaultStrategyText: FC<VaultStrategyTextProps> = ({
  type,
  underlyingAssets,
  asset
}) => {
  const isToken = useIsTokenCompounder(type)
  const { data: token } = useTokenOrNative({ address: asset })
  const { data: vaultTokens } = useVaultTokens({
    asset,
    type
  })
  const { data: ybToken } = useTokenOrNative({ address: vaultTokens.ybTokenAddress })
  return (
    <>
    {isToken ? (
      // THE TEXT HERE WAS WRITTEN FOR THE GLP COUMPOUNDER
      <div className="max-h-[120px] overflow-auto">
        <p className="leading-loose text-justify">
          This vault accepts deposits in form of its primary asset {token?.symbol.toLocaleUpperCase()} and any of its underlying assets mentioned below, all of which will be converted to staked {token?.symbol.toLocaleUpperCase()} automatically. <br/>Deposited assets are used to provide liquidity for GMX traders, earning trading fees plus GMX emissions on its staked {token?.symbol.toLocaleUpperCase()}. <br/>The vault auto-compounds the accumulated rewards periodically into more staked {token?.symbol.toLocaleUpperCase()}. <br/>Investors receive vault shares as ERC20 tokens called {ybToken?.symbol.toLocaleUpperCase()}, representing their pro-rata share of the compounding funds. <br/>Investors can use {ybToken?.symbol.toLocaleUpperCase()} in other Fortress products or integrated protocols. <br/>The staked {token?.symbol.toLocaleUpperCase()} contains the following basket of assets:{" "}
          {underlyingAssets?.map((address, index) => (
            <Fragment key={`underlying-asset-${index}`}>
              {underlyingAssets.length > 2 &&
              index > 0 &&
              index !== underlyingAssets.length - 1
                ? ", "
                : index > 0
                ? " and "
                : null}
              <TokenSymbol
                key={`token-symbol-${index}`}
                address={(address ?? "0x") as `0x${string}`}
              />
            </Fragment>
          ))}
          .
        </p>
      </div>
    ) : (
      <p className="leading-loose">
        This token represents a {type === "curve" ? "Curve" : "Balancer"}{" "}
        liquidity pool. Holders earn fees from users trading in the pool,
        and can also deposit the LP to Curve's gauges to earn CRV
        emissions. This Curve v2 crypto pool contains{" "}
        {underlyingAssets?.map((address, index) => (
          <Fragment key={`underlying-asset-${index}`}>
            {underlyingAssets.length > 2 &&
            index > 0 &&
            index !== underlyingAssets.length - 1
              ? ", "
              : index > 0
              ? " and "
              : null}
            <TokenSymbol
              key={`token-symbol-${index}`}
              address={(address ?? "0x") as `0x${string}`}
            />
          </Fragment>
        ))}
        .
      </p>
    )}
    </>    
  )
}
import Link from "next/link"
import { FC, MouseEventHandler } from "react"
import { BiInfoCircle } from "react-icons/bi"
import { useAccount } from "wagmi"

import { formatPercentage } from "@/lib/helpers/formatPercentage"
import { VaultProps } from "@/lib/types"
import { useIsTokenCompounder, useTokenOrNative, useVaultFees } from "@/hooks"

import { ModalBaseProps } from "@/components/Modal/lib/ModalBase"
import PurpleModal, {
  PurpleModalContent,
  PurpleModalHeader,
} from "@/components/Modal/lib/PurpleModal"
import { VaultStrategyModalAmmApr } from "@/components/Modal/VaultStrategyModal/lib/VaultStrategyModalAmmApr"
import { VaultStrategyText } from "@/components/Modal/VaultStrategyModal/lib/VaultStrategyModalText"
import { VaultStrategyModalTokenApr } from "@/components/Modal/VaultStrategyModal/lib/VaultStrategyModalTokenApr"
import Skeleton from "@/components/Skeleton"
import Tooltip from "@/components/Tooltip"

import {
  FortIconAddToWallet,
  FortIconClose,
  FortIconExternalLink,
} from "@/icons"

export const VaultStrategyModal: FC<VaultProps & ModalBaseProps> = ({
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
            <div className="p-4 pb-5 md:px-5">
              {isToken ? (
                <VaultStrategyModalTokenApr {...vaultProps} />
              ) : (
                <VaultStrategyModalAmmApr {...vaultProps} />
              )}
            </div>
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
                  {formatPercentage(fees.data?.depositFee)}
                </Skeleton>
              </dd>
              <dt>
                <Tooltip label="Withdrawal fees stay in the vault and are distributed to vault participants. Used as a mechanism to protect against mercenary capital.">
                  <span className="flex items-center gap-1">
                    Withdrawal <BiInfoCircle className="h-5 w-5" />
                  </span>
                </Tooltip>
              </dt>
              <dd className="text-right">
                <Skeleton isLoading={fees.isLoading}>
                  {formatPercentage(fees.data?.withdrawFee)}
                </Skeleton>
              </dd>
              <dt>Management</dt>
              <dd className="text-right">
                <Skeleton isLoading={fees.isLoading}>
                  {formatPercentage(fees.data?.managementFee)}
                </Skeleton>
              </dd>
              <dt>Performance</dt>
              <dd className="text-right">
                <Skeleton isLoading={fees.isLoading}>
                  {formatPercentage(fees.data?.platformFee)}
                </Skeleton>
              </dd>
            </dl>
          </div>
        </div>
      </PurpleModalContent>
    </PurpleModal>
  )
}

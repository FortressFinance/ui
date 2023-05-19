import * as Dialog from "@radix-ui/react-dialog"
import Link from "next/link"
import { FC, MouseEventHandler } from "react"
import { useAccount, useNetwork } from "wagmi"

import { useTokenOrNative } from "@/hooks"

import { ModalBaseProps } from "@/components/Modal/lib/ModalBase"
import PurpleModal, {
  PurpleModalContent,
  PurpleModalHeader,
} from "@/components/Modal/lib/PurpleModal"
import {
  VaultStrategyLeftPanel,
  VaultStrategyRightPanel,
} from "@/components/Modal/VaultStrategyModal"
import Tooltip from "@/components/Tooltip"
import { VaultRowPropsWithProduct } from "@/components/VaultRow"

import {
  FortIconAddToWallet,
  FortIconClose,
  FortIconExternalLink,
} from "@/icons"

export const VaultStrategyModal: FC<
  VaultRowPropsWithProduct & ModalBaseProps
> = ({ isOpen, onClose, ...vaultProps }) => {
  const { connector } = useAccount()
  const { chain } = useNetwork()

  const { data: ybToken } = useTokenOrNative({
    address: vaultProps.ybTokenAddress ?? "0x",
  })

  // limit the token name to 11 char max
  const truncateString = (str?: string): string => (str ? str.slice(0, 11) : "")
  const addTokenToWallet: MouseEventHandler<HTMLButtonElement> = () => {
    if (ybToken && ybToken.address && connector && connector.watchAsset) {
      connector.watchAsset({
        ...ybToken,
        symbol: truncateString(ybToken.symbol),
      })
    }
  }
  const label = `Add ${ybToken?.symbol} to wallet`

  return (
    <PurpleModal
      className="max-xl:max-w-4xl xl:max-w-5xl"
      isOpen={isOpen}
      onClose={onClose}
    >
      {vaultProps.asset && vaultProps.type && vaultProps.ybTokenAddress && (
        <>
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
              {chain?.blockExplorers?.default.url &&
                vaultProps.ybTokenAddress && (
                  <Tooltip label="View contract">
                    <Link
                      className="h-6 w-6 p-[1px]"
                      href={`${chain.blockExplorers.default.url}/address/${vaultProps.ybTokenAddress}`}
                      target="_blank"
                    >
                      <FortIconExternalLink className="h-full w-full" />
                      <span className="sr-only">View contract</span>
                    </Link>
                  </Tooltip>
                )}
            </div>
            <Dialog.Close className="h-6 w-6 p-[1px]">
              <FortIconClose className="h-full w-full fill-white" />
              <span className="sr-only">Close</span>
            </Dialog.Close>
          </PurpleModalHeader>

          <PurpleModalContent className="grid grid-cols-1 divide-pink-800 p-0 md:grid-cols-[3fr,2fr] md:divide-x md:p-0 lg:grid-cols-[2fr,1fr]">
            <VaultStrategyLeftPanel {...vaultProps} />
            <VaultStrategyRightPanel {...vaultProps} />
          </PurpleModalContent>
        </>
      )}
    </PurpleModal>
  )
}

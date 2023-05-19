import * as Dialog from "@radix-ui/react-dialog"
import * as Tabs from "@radix-ui/react-tabs"
import Link from "next/link"
import { FC, MouseEventHandler } from "react"
import { useAccount, useNetwork } from "wagmi"

import { useTokenOrNative } from "@/hooks"

import { ModalBaseProps } from "@/components/Modal/lib/ModalBase"
import PurpleModal, {
  PurpleModalContent,
  PurpleModalHeader,
} from "@/components/Modal/lib/PurpleModal"
import { ManagedVaultsActivityTable } from "@/components/Modal/VaultStrategyModal"
import Tooltip from "@/components/Tooltip"
import { VaultRowPropsWithProduct } from "@/components/VaultRow"

import {
  FortIconAddToWallet,
  FortIconClose,
  FortIconExternalLink,
} from "@/icons"

export const ManagedVaultsStrategyModal: FC<
  VaultRowPropsWithProduct & ModalBaseProps
> = ({ isOpen, onClose, ...vaultProps }) => {
  const { connector } = useAccount()
  const { chain } = useNetwork()

  const { data: ybToken } = useTokenOrNative({
    address: vaultProps.ybTokenAddress ?? "0x",
  })

  const strategyTextValue = undefined

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
            <div className="max-md:row-start-2">
              <Tabs.Root
                className="flex w-full flex-col"
                defaultValue="tabDescription"
              >
                <Tabs.List
                  className="flex shrink-0 border-b border-pink-800 max-sm:border-t md:border-t"
                  aria-label="Vault description"
                >
                  <Tabs.Trigger
                    className="h-[41px] w-1/2 p-3 text-xs font-semibold uppercase text-pink-300 ui-state-active:border-b ui-state-active:border-pink-400 ui-state-active:bg-pink/10 max-md:text-center md:px-5"
                    value="tabDescription"
                  >
                    Vault description
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    className="h-[41px] w-1/2 p-3 text-xs font-semibold uppercase text-pink-300 ui-state-active:border-b ui-state-active:border-pink-400 ui-state-active:bg-pink/10 max-md:text-center md:px-5"
                    value="tabActivity"
                  >
                    Activity
                  </Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content
                  className="space-y-3 p-4 pb-5 leading-relaxed text-pink-50 max-md:text-sm md:px-5"
                  value="tabDescription"
                >
                  {strategyTextValue ?? "No description available"}
                </Tabs.Content>
                <Tabs.Content
                  className="space-y-3 py-4 pb-5 leading-relaxed text-pink-50 max-md:text-sm"
                  value="tabActivity"
                >
                  <ManagedVaultsActivityTable />
                </Tabs.Content>
              </Tabs.Root>
            </div>

            <div className="md:block md:divide-x-0">
              <Tabs.Root className="flex w-full flex-col" defaultValue="tabApr">
                <Tabs.List
                  className="flex shrink-0 border-b border-pink-800 max-sm:border-t md:border-t"
                  aria-label="Vault right panel"
                >
                  <Tabs.Trigger
                    className="h-[41px] w-1/3 p-3 text-xs font-semibold uppercase text-pink-300 ui-state-active:border-b ui-state-active:border-pink-400 ui-state-active:bg-pink/10 max-md:text-center md:px-5"
                    value="tabApr"
                  >
                    APR
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    className="h-[41px] w-1/3 p-3 text-xs font-semibold uppercase text-pink-300 ui-state-active:border-b ui-state-active:border-pink-400 ui-state-active:bg-pink/10 max-md:text-center md:px-5"
                    value="tabFees"
                  >
                    Fees
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    className="h-[41px] w-[auto] p-3 text-xs font-semibold uppercase text-pink-300 ui-state-active:border-b ui-state-active:border-pink-400 ui-state-active:bg-pink/10 max-md:text-center md:px-5"
                    value="tabAllocations"
                  >
                    Allocations
                  </Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content
                  className="space-y-3 p-4 pb-5 leading-relaxed text-pink-50 max-md:text-sm md:px-5"
                  value="tabApr"
                >
                  fgdg
                </Tabs.Content>
                <Tabs.Content
                  className="space-y-3 py-4 pb-5 leading-relaxed text-pink-50 max-md:text-sm md:px-5"
                  value="tabFees"
                >
                  ddsfsdf
                </Tabs.Content>
                <Tabs.Content
                  className="space-y-3 py-4 pb-5 leading-relaxed text-pink-50 max-md:text-sm md:px-5"
                  value="tabAllocations"
                >
                  dfsfds
                </Tabs.Content>
              </Tabs.Root>
            </div>
          </PurpleModalContent>
        </>
      )}
    </PurpleModal>
  )
}

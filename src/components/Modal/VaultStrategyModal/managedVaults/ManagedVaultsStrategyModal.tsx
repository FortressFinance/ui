import * as Dialog from "@radix-ui/react-dialog"
import * as Tabs from "@radix-ui/react-tabs"
import Link from "next/link"
import { FC, MouseEventHandler } from "react"
import { BiInfoCircle } from "react-icons/bi"
import { useAccount, useNetwork } from "wagmi"

import { formatPercentage } from "@/lib/helpers"
import { useTokenOrNative, useVaultFees } from "@/hooks"

import { ModalBaseProps } from "@/components/Modal/lib/ModalBase"
import PurpleModal, {
  PurpleModalContent,
  PurpleModalHeader,
} from "@/components/Modal/lib/PurpleModal"
import {
  ManagedVaultsActivityTable,
  ManagedVaultsStrategyModalAllocations,
  ManagedVaultsStrategyModalApr,
} from "@/components/Modal/VaultStrategyModal"
import Skeleton from "@/components/Skeleton"
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

  const fees = useVaultFees(vaultProps)

  const strategyTextValue =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In gravida maximus tellus vitae accumsan. Suspendisse maximus placerat risus, vitae rhoncus quam dapibus sed. In pulvinar purus ornare ligula aliquet porttitor. Nulla facilisi. Nulla malesuada, augue ac gravida varius, purus neque ultricies enim, non varius tortor mauris eu elit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Aliquam purus nulla, eleifend in metus at, sollicitudin laoreet elit. Vestibulum finibus erat sed massa euismod convallis. Nunc auctor augue vel laoreet pellentesque. Nullam et egestas erat.  Aenean dignissim turpis ac sodales congue. Nam eu accumsan lacus. Aliquam erat volutpat. In lobortis eros scelerisque nibh euismod sollicitudin. Vivamus id diam id dolor fringilla varius. Vestibulum in nibh sit amet eros malesuada congue id et mauris. Aliquam condimentum odio venenatis, congue est sed, consequat nulla. Sed sem nunc, suscipit sit amet neque nec, eleifend dignissim mi. Nullam commodo magna quis nisi lacinia posuere. "

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
                    className="h-[41px] w-[auto] p-3 text-xs font-semibold uppercase text-pink-300 ui-state-active:border-b ui-state-active:border-pink-400 ui-state-active:bg-pink/10 max-md:w-1/3 max-md:text-center md:px-5"
                    value="tabAllocations"
                  >
                    Allocations
                  </Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content
                  className="space-y-3 p-4 px-5 pb-5 leading-relaxed text-pink-50 max-md:text-sm"
                  value="tabApr"
                >
                  <ManagedVaultsStrategyModalApr />
                </Tabs.Content>
                <Tabs.Content
                  className="space-y-3 px-5 py-4 pb-5 leading-relaxed text-pink-50 max-md:text-sm"
                  value="tabFees"
                >
                  <dl className="grid grid-cols-[max-content,auto] gap-2 text-sm text-pink-50">
                    <dt>Deposit</dt>
                    <dd className="text-right">
                      <Skeleton isLoading={fees.isLoading}>
                        {formatPercentage(fees.data?.depositFee)}
                      </Skeleton>
                    </dd>
                    <dt>
                      <Tooltip label="Withdrawal fees stay in the vault and are distributed to vault participants. Used as a mechanism to protect against mercenary capital.">
                        <span className="flex items-center gap-1">
                          Withdrawal{" "}
                          <BiInfoCircle className="h-5 w-5 cursor-pointer" />
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
                </Tabs.Content>
                <Tabs.Content
                  className="space-y-3 px-5 py-4 pb-5 leading-relaxed text-pink-50 max-md:text-sm"
                  value="tabAllocations"
                >
                  <ManagedVaultsStrategyModalAllocations />
                </Tabs.Content>
              </Tabs.Root>
            </div>
          </PurpleModalContent>
        </>
      )}
    </PurpleModal>
  )
}

import { Disclosure, Tab, Transition } from "@headlessui/react"
import { FC, Fragment, MouseEventHandler, useState } from "react"

import clsxm from "@/lib/clsxm"
import { ConcentratorVaultProps } from "@/lib/types"
import { useVault } from "@/hooks"

import { AssetLogo } from "@/components/Asset"
import { ConcentratorVaultDepositForm } from "@/components/Concentrator"
import { ConcentratorVaultApy } from "@/components/Concentrator/ConcentratorVaultApy"
import { ConcentratorVaultTvl } from "@/components/Concentrator/ConcentratorVaultTvl"
import { ConcentratorVaultUserBalance } from "@/components/Concentrator/ConcentratorVaultUserBalance"
import { TableCell, TableRow } from "@/components/Table"
import { VaultName } from "@/components/VaultRow/lib"

import { FortIconChevronDownCircle } from "@/icons"

export const ConcentratorVaultRow: FC<ConcentratorVaultProps> = (props) => {
  const [isVaultOpen, setIsVaultOpen] = useState(false)

  const { isLoading } = useVault({
    asset: props.primaryAsset,
    vaultAddress: props.targetAsset,
  })

  const toggleVaultOpen: MouseEventHandler<
    HTMLButtonElement | HTMLDivElement
  > = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsVaultOpen((v) => !v)
  }

  return (
    <Disclosure as={Fragment} key={props.primaryAsset}>
      <TableRow
        className="lg:grid-cols-[4fr,1fr,1fr,1fr,3.5rem] lg:py-6 lg:first:rounded-t-none"
        onClick={toggleVaultOpen}
        disabled={isLoading}
      >
        {/* Row of vault info */}
        <TableCell className="relative grid grid-cols-[max-content,auto,max-content] items-center gap-x-3 max-lg:-mx-3 max-lg:border-b max-lg:border-b-pink/30 max-lg:px-3 max-lg:pb-3.5 lg:pointer-events-none">
          <AssetLogo
            className="flex h-12 w-12"
            tokenAddress={props.targetAsset}
          />

          <span className="line-clamp-2 max-lg:mr-8">
            <VaultName
              asset={props.primaryAsset}
              vaultAddress={props.targetAsset}
            />
          </span>

          {/* Mobile: expand/collapse button */}
          <button
            className="group absolute inset-0 flex items-center justify-end focus:outline-none lg:hidden"
            disabled={isLoading}
            onClick={toggleVaultOpen}
          >
            <div
              className={clsxm(
                "group mb-3 mr-5 block h-6 w-6 rounded-sm transition-transform duration-200 group-focus-visible:outline-double",
                {
                  "cursor-wait": isLoading,
                  "-rotate-180": isVaultOpen,
                }
              )}
            >
              <FortIconChevronDownCircle
                className="h-full w-full fill-white"
                aria-label="Open vault"
              />
            </div>
          </button>
        </TableCell>

        {/* Desktop: APY, TVL, Balance */}
        <TableCell className="pointer-events-none text-center max-lg:hidden">
          <ConcentratorVaultApy {...props} />
        </TableCell>
        <TableCell className="pointer-events-none text-center max-lg:hidden">
          <ConcentratorVaultTvl {...props} />
        </TableCell>
        <TableCell className="pointer-events-none text-center max-lg:hidden">
          <ConcentratorVaultUserBalance {...props} />
        </TableCell>

        {/* Desktop: Action buttons */}
        <TableCell className="relative flex items-center max-lg:hidden">
          <button
            className="group absolute inset-0 flex items-center justify-end focus:outline-none"
            disabled={isLoading}
            onClick={toggleVaultOpen}
          >
            <div
              className={clsxm(
                "group z-[1] block h-5 w-5 rounded-sm transition-transform duration-200 group-focus-visible:outline-double",
                {
                  "cursor-wait": isLoading,
                  "-rotate-180": isVaultOpen,
                }
              )}
            >
              <FortIconChevronDownCircle
                className="h-5 w-5 fill-white"
                aria-label="Open vault"
              />
            </div>
          </button>
        </TableCell>

        {/* Forms */}
        <Transition
          show={isVaultOpen}
          className="col-span-full overflow-hidden max-lg:-mx-3"
          enter="transition-all duration-200"
          enterFrom="transform opacity-0 max-h-0"
          enterTo="transform opacity-100 max-h-80"
          leave="transition-all duration-200"
          leaveFrom="transform opacity-100 max-h-80"
          leaveTo="transform opacity-0 max-h-0"
        >
          <Disclosure.Panel static>
            {/* Desktop: forms */}
            <div className="mt-6 grid grid-cols-2 gap-4 max-lg:hidden">
              <ConcentratorVaultDepositForm {...props} />
              {/* <VaultWithdrawForm {...props} /> */}
            </div>

            {/* Mobile: forms */}
            <div className="border-b border-b-pink/30 lg:hidden">
              <Tab.Group>
                <Tab.List
                  as="div"
                  className="divide-x divide-pink/30 border-b border-b-pink/30"
                >
                  <Tab as={Fragment}>
                    {({ selected }) => (
                      <button
                        className={clsxm(
                          "transition-color w-1/2 py-3.5 text-xs font-semibold uppercase text-pink-100/50 duration-200 ease-linear",
                          { "bg-pink/10 text-orange-400": selected }
                        )}
                      >
                        Deposit
                      </button>
                    )}
                  </Tab>
                  <Tab as={Fragment}>
                    {({ selected }) => (
                      <button
                        className={clsxm(
                          "transition-color w-1/2 py-3.5 text-xs font-semibold uppercase text-pink-100/50 duration-200 ease-linear",
                          { "bg-pink/10 text-orange-400": selected }
                        )}
                      >
                        Withdraw
                      </button>
                    )}
                  </Tab>
                </Tab.List>

                <Tab.Panels>
                  <Tab.Panel>
                    <ConcentratorVaultDepositForm {...props} />
                  </Tab.Panel>
                  <Tab.Panel>
                    {/* <VaultWithdrawForm {...props} /> */}
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
            </div>
          </Disclosure.Panel>
        </Transition>
      </TableRow>
    </Disclosure>
  )
}

import { Disclosure, Popover, Portal } from "@headlessui/react"
import { AnimatePresence, easeInOut, motion, MotionConfig } from "framer-motion"
import { FC, Fragment, MouseEventHandler, useEffect, useState } from "react"
import { usePopper } from "react-popper"

import clsxm from "@/lib/clsxm"
import useCompounderPoolAsset from "@/hooks/data/useCompounderPoolAsset"
import useCompounderUnderlyingAssets from "@/hooks/data/useCompounderUnderlyingAssets"
import useCompounderYbTokens from "@/hooks/data/useCompounderYbTokens"
import useTokenCompounderUnderlyingAssets from "@/hooks/data/useTokenCompounderUnderlyingAssets"
import { VaultProps } from "@/hooks/types"
import useIsCurve from "@/hooks/useIsCurve"
import useIsTokenCompounder from "@/hooks/useIsTokenCompounder"

import AssetLogo from "@/components/AssetLogo"
import TxSettingsForm from "@/components/TxSettingsForm"
import {
  VaultApr,
  VaultDepositedLp,
  VaultName,
  VaultTvl,
} from "@/components/Vault/VaultData"
import VaultDepositForm from "@/components/Vault/VaultDepositForm"
import VaultStrategyButton from "@/components/Vault/VaultStrategy"
import {
  VaultTableCell,
  VaultTableRow,
} from "@/components/Vault/VaultTableNode"
import VaultWithdrawForm from "@/components/Vault/VaultWithdrawForm"

import ChevronDownCircle from "~/svg/icons/chevron-down-circle.svg"
import Cog from "~/svg/icons/cog.svg"

const VaultRow: FC<VaultProps> = (props) => {
  const [isVaultOpen, setIsVaultOpen] = useState(false)
  const [txSettingsCog, setTxSettingsCog] = useState<HTMLButtonElement | null>(
    null
  )
  const [txSettingsPopover, setTxSettingsPopover] =
    useState<HTMLDivElement | null>(null)
  const { styles, attributes } = usePopper(txSettingsCog, txSettingsPopover, {
    placement: "bottom-end",
    modifiers: [
      { name: "preventOverflow", options: { padding: 8 } },
      { name: "offset", options: { offset: [-3, 4] } },
    ],
  })
  const [updatedProps, setUpdatedProps] = useState<VaultProps>(props)
  const isToken = useIsTokenCompounder(props.type)

  const { data: ybTokenAddress } = useCompounderYbTokens({
    address: props.address,
    type: props.type,
  })

  useEffect(() => {
    setUpdatedProps({
      address: (ybTokenAddress ?? "0x") as `0x${string}`,
      type: props.type,
    })
  }, [props.type, ybTokenAddress])

  const { isLoading: isLoadingAsset } = useCompounderPoolAsset(updatedProps)
  const { data: tokenUnderlyingAssets, isLoading: isLoadingTokenUnderlying } =
    useTokenCompounderUnderlyingAssets(updatedProps)
  const { data: underlyingAssets, isLoading: isLoadingUnderlying } =
    useCompounderUnderlyingAssets(updatedProps)

  const isLoading =
    isLoadingAsset || isLoadingUnderlying || isLoadingTokenUnderlying

  const isCurve = useIsCurve(props.type)

  const toggleVaultOpen: MouseEventHandler<
    HTMLButtonElement | HTMLDivElement
  > = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsVaultOpen((v) => !v)
  }

  return (
    <>
      <MotionConfig transition={{ duration: 0.2, ease: easeInOut }}>
        <Disclosure as={Fragment}>
          <VaultTableRow
            className="first:rounded-t-none lg:py-6"
            onClick={toggleVaultOpen}
            disabled={isLoading}
          >
            {/* Row of vault info */}
            <VaultTableCell className="pointer-events-none sm:grid sm:grid-cols-[max-content,auto,max-content] sm:items-center sm:space-x-3">
              <div className="hidden h-10 w-10 items-center justify-center rounded-full bg-white sm:flex">
                <AssetLogo
                  className="h-6 w-6"
                  name={
                    isCurve === undefined
                      ? "token"
                      : isCurve
                      ? "curve"
                      : "balancer"
                  }
                />
              </div>
              <VaultName
                key={`name_${updatedProps.type}_${updatedProps.address}`}
                {...updatedProps}
              />
              <VaultStrategyButton
                key={`strategy_${updatedProps.type}_${updatedProps.address}`}
                {...updatedProps}
              />
            </VaultTableCell>
            <VaultTableCell className="pointer-events-none text-center">
              <VaultApr
                key={`apr_${updatedProps.type}_${updatedProps.address}`}
                {...updatedProps}
              />
            </VaultTableCell>
            <VaultTableCell className="pointer-events-none text-center">
              <VaultTvl
                key={`tvl_${updatedProps.type}_${updatedProps.address}`}
                {...updatedProps}
              />
            </VaultTableCell>
            <VaultTableCell className="pointer-events-none text-center">
              <VaultDepositedLp
                key={`deposited_${updatedProps.type}_${updatedProps.address}`}
                {...updatedProps}
              />
            </VaultTableCell>

            {/* Action buttons */}
            <VaultTableCell className="flex items-center space-x-2">
              <motion.button
                animate={{
                  rotate: isVaultOpen ? -180 : 0,
                  x: isVaultOpen ? 0 : "125%",
                }}
                initial={{ x: "125%" }}
                className={clsxm("group relative z-[1] h-7 w-7", {
                  "cursor-wait": isLoading,
                })}
                onClick={toggleVaultOpen}
                disabled={isLoading}
              >
                <ChevronDownCircle
                  className="h-7 w-7"
                  aria-label="Open vault"
                />
              </motion.button>
              <AnimatePresence initial={false}>
                {isVaultOpen && (
                  <Popover className="relative">
                    {({ open }) => (
                      <>
                        <Popover.Button as={Fragment}>
                          <motion.button
                            ref={setTxSettingsCog}
                            className="relative z-[1] flex h-7 w-7 items-center justify-center"
                            initial={{ x: "100%", opacity: 0 }}
                            animate={{
                              x: 0,
                              opacity: 1,
                              rotate: open ? -180 : 0,
                            }}
                            exit={{ x: "100%", opacity: 0 }}
                          >
                            <Cog className="h-6 w-6" />
                          </motion.button>
                        </Popover.Button>

                        <AnimatePresence>
                          {open && (
                            <Portal>
                              <Popover.Panel as={Fragment} static>
                                <motion.div
                                  ref={setTxSettingsPopover}
                                  className="z-20 w-full max-w-xs rounded-md bg-orange-400 p-4 shadow-lg"
                                  style={styles.popper}
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  {...attributes.popper}
                                >
                                  <TxSettingsForm />
                                </motion.div>
                              </Popover.Panel>
                            </Portal>
                          )}
                        </AnimatePresence>
                      </>
                    )}
                  </Popover>
                )}
              </AnimatePresence>
            </VaultTableCell>

            {/* Collapsible forms */}
            <AnimatePresence>
              {isVaultOpen && (
                <Disclosure.Panel as={Fragment} static>
                  <motion.div
                    className="col-span-full overflow-hidden"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                  >
                    {/* Margins or padding on the motion.div will cause janky animation, use margins inside */}
                    <div className="mt-6 grid gap-3 md:grid-cols-2 md:gap-4">
                      <VaultDepositForm
                        key={`deposit_${updatedProps.type}_${updatedProps.address}`}
                        underlyingAssets={
                          isToken ? tokenUnderlyingAssets : underlyingAssets
                        }
                        type={updatedProps.type}
                        address={updatedProps.address}
                      />
                      <VaultWithdrawForm
                        key={`withdraw_${updatedProps.type}_${updatedProps.address}`}
                        underlyingAssets={
                          isToken ? tokenUnderlyingAssets : underlyingAssets
                        }
                        type={updatedProps.type}
                        address={updatedProps.address}
                      />
                    </div>
                  </motion.div>
                </Disclosure.Panel>
              )}
            </AnimatePresence>
          </VaultTableRow>
        </Disclosure>
      </MotionConfig>
    </>
  )
}

export default VaultRow

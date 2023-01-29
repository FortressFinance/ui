import { Disclosure } from "@headlessui/react"
import { AnimatePresence, easeInOut, motion, MotionConfig } from "framer-motion"
import { FC, Fragment, MouseEventHandler, useState } from "react"

import { VaultProps } from "@/hooks/types"
import useIsCurve from "@/hooks/useIsCurve"

import AssetLogo from "@/components/AssetLogo"
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
  const [_isSettingsOpen, setIsSettingsOpen] = useState(false)

  const isCurve = useIsCurve(props.type)

  const toggleVaultOpen: MouseEventHandler<
    HTMLButtonElement | HTMLDivElement
  > = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsVaultOpen((v) => !v)
  }

  const toggleSettingsOpen: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsSettingsOpen(true)
  }

  return (
    <>
      <MotionConfig transition={{ duration: 0.2, ease: easeInOut }}>
        <Disclosure as={Fragment}>
          <VaultTableRow
            className="first:rounded-t-none lg:py-6"
            onClick={toggleVaultOpen}
          >
            {/* Row of vault info */}
            <VaultTableCell className="pointer-events-none sm:grid sm:grid-cols-[max-content,auto,max-content] sm:items-center sm:space-x-3">
              <div className="hidden h-10 w-10 items-center justify-center rounded-full bg-white sm:flex">
                <AssetLogo
                  className="h-6 w-6"
                  name={isCurve ? "curve" : "balancer"}
                />
              </div>
              <VaultName {...props} />
              <VaultStrategyButton {...props} />
            </VaultTableCell>
            <VaultTableCell className="pointer-events-none text-center">
              <VaultApr {...props} />
            </VaultTableCell>
            <VaultTableCell className="pointer-events-none text-center">
              <VaultTvl {...props} />
            </VaultTableCell>
            <VaultTableCell className="pointer-events-none text-center">
              <VaultDepositedLp {...props} />
            </VaultTableCell>

            {/* Action buttons */}
            <VaultTableCell className="flex items-center space-x-2">
              <motion.button
                animate={{
                  rotate: isVaultOpen ? -180 : 0,
                  x: isVaultOpen ? 0 : "125%",
                }}
                initial={{ x: "125%" }}
                className="group relative z-[1] h-7 w-7"
                onClick={toggleVaultOpen}
              >
                <ChevronDownCircle
                  className="h-7 w-7"
                  aria-label="Open vault"
                />
              </motion.button>
              <AnimatePresence initial={false}>
                {isVaultOpen && (
                  <motion.button
                    className="relative z-[1] flex h-7 w-7 items-center justify-center"
                    initial={{ x: "100%", opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: "100%", opacity: 0 }}
                    whileHover={{ rotate: 270 }}
                    onClick={toggleSettingsOpen}
                  >
                    <Cog className="h-6 w-6" />
                  </motion.button>
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
                      <VaultDepositForm {...props} />
                      <VaultWithdrawForm {...props} />
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

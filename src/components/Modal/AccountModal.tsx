import { Dialog } from "@headlessui/react"
import copy from "copy-to-clipboard"
import Link from "next/link"
import { FC, useEffect, useState } from "react"
import { useAccount, useDisconnect, useNetwork } from "wagmi"

import clsxm from "@/lib/clsxm"

import Address from "@/components/Address"
import Button from "@/components/Button"
import { ConnectModalBase } from "@/components/Modal/lib/ConnectModalBase"

import {
  FortIconCloseCircle,
  FortIconCopy,
  FortIconExternalLinkAlt,
} from "@/icons"

import { useGlobalStore } from "@/store"

const RESET_COPY_BTN_MS = 1000

export const AccountModal: FC = () => {
  const { address, connector: activeConnector } = useAccount()
  const { disconnect } = useDisconnect()
  const { chain } = useNetwork()

  const [isOpen, onClose] = useGlobalStore((store) => [
    store.activeModal === "account",
    () => store.setActiveModal(null),
  ])

  const [isCopied, setCopied] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isCopied) {
        setCopied(false)
      }
    }, RESET_COPY_BTN_MS)

    return () => {
      clearTimeout(timeout)
    }
  }, [isCopied, setCopied])

  const onClickDisconnect = () => {
    disconnect()
    onClose()
  }

  return (
    <ConnectModalBase isOpen={isOpen} onClose={onClose}>
      <div className="grid grid-cols-[1fr,max-content] grid-rows-1 items-center">
        <Dialog.Title
          as="h1"
          className="col-span-2 col-start-1 row-start-1 text-center font-display text-3xl sm:text-4xl"
        >
          Account
        </Dialog.Title>
        <button onClick={onClose} className="col-start-2 row-start-1">
          <FortIconCloseCircle className="h-8 w-8" />
        </button>
      </div>

      <div className="space-y-3 divide-y divide-orange-600">
        <div className="py-5 sm:flex sm:items-center sm:justify-between">
          <div className="font-medium max-sm:mb-3 max-sm:text-center">
            <span className="sm:block">Connected with</span>
            <span className="sm:hidden">&nbsp;</span>
            <span className="sm:block">{activeConnector?.name ?? "..."}</span>
          </div>

          <Button
            className="max-sm:w-1/2"
            onClick={onClickDisconnect}
            variant="plain-negative"
          >
            Disconnect
          </Button>
        </div>

        <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap py-2 pt-4 text-xl font-medium max-sm:text-center sm:text-2xl">
          {address && <Address>{address}</Address>}
        </div>
        <div className="flex items-center justify-between pt-5 text-sm">
          <div
            className={clsxm(
              "flex cursor-pointer items-center transition-colors duration-100",
              {
                "text-white/50": isCopied === true,
              }
            )}
            onClick={() => setCopied(copy(address ?? ""))}
          >
            <FortIconCopy className="mr-2 inline h-5 w-5 stroke-current" />
            <span>{isCopied ? "Copied!" : "Copy address"}</span>
          </div>
          {chain?.blockExplorers?.default.url && address && (
            <Link
              href={chain.blockExplorers.default.url + "/address/" + address}
              className="flex items-center"
              target="_blank"
            >
              <FortIconExternalLinkAlt className="mr-2 inline h-4 w-4" />
              <span>View on explorer</span>
            </Link>
          )}
        </div>
      </div>
    </ConnectModalBase>
  )
}

import { Transition } from "@headlessui/react"
import { FC, Fragment, PropsWithChildren } from "react"

import clsxm from "@/lib/clsxm"

import { FortIconClose } from "@/icons"

export type ToastComponentProps = {
  isVisible: boolean
  onDismiss?: () => void
  className?: string
}

export type TransactionToastComponentProps = ToastComponentProps & {
  message?: string
  txHash?: string
}

export const Toast: FC<PropsWithChildren<ToastComponentProps>> = ({
  className,
  isVisible,
  onDismiss,
  children,
}) => {
  return (
    <Transition
      as={Fragment}
      show={isVisible}
      enter="transition ease-linear duration-100"
      enterFrom="transform opacity-0"
      enterTo="transform opacity-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100"
      leaveTo="transform opacity-0"
    >
      <div
        className={clsxm(
          "w-full max-w-xs rounded-md bg-gray-800 p-4 text-gray-400 shadow",
          className
        )}
      >
        {children}
        {!!onDismiss && (
          <button
            onClick={onDismiss}
            className={clsxm(
              "ml-auto inline-flex h-7 w-7 rounded-md bg-gray-800 p-1.5 text-gray-500 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-gray-300",
              className
            )}
          >
            <span className="sr-only">Close</span>
            <FortIconClose className="h-4 w-4 fill-white" />
          </button>
        )}
      </div>
    </Transition>
  )
}

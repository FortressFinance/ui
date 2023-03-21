import { Transition } from "@headlessui/react"
import { FC, Fragment, PropsWithChildren } from "react"

import clsxm from "@/lib/clsxm"

export type ToastComponentProps = {
  isVisible: boolean
  className?: string
}

export type TransactionToastComponentProps = ToastComponentProps & {
  message: string
  txHash?: string
}

export const Toast: FC<PropsWithChildren<ToastComponentProps>> = ({
  className,
  isVisible,
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
      </div>
    </Transition>
  )
}

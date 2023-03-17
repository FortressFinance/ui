import { FC, PropsWithChildren } from "react"

import clsxm from "@/lib/clsxm"

import { FortIconClose } from "@/icons"

export type ToastComponentProps = {
  isVisible: boolean
  onDismiss?: () => void
  className?: string
}

export const Toast: FC<PropsWithChildren<ToastComponentProps>> = ({
  className,
  isVisible,
  onDismiss,
  children,
}) => {
  return (
    <div
      className={clsxm(
        `${
          isVisible ? "animate-enter opacity-100" : "animate-leave opacity-0"
        } w-full max-w-xs rounded-md bg-gray-800 p-4 text-gray-400 shadow`,
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
  )
}

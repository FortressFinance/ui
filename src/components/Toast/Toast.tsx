import { FC, PropsWithChildren } from "react"

import clsxm from "@/lib/clsxm"

import { FortIconClose } from "@/icons"

export type ToastComponentProps = {
  isVisible: boolean
  onDismiss?: () => void
  className?: string,
}

export const Toast: FC<PropsWithChildren<ToastComponentProps>> = ({
  className,
  isVisible,
  onDismiss,
  children
}) => {
  return (
    <div
      className={clsxm(`${
        isVisible ? 'animate-enter opacity-100' : 'animate-leave opacity-0'
      } w-full max-w-xs p-4 rounded-md shadow text-gray-400 bg-gray-800`, className)}
    >
      {children}
      { !!onDismiss && (
        <button
          onClick={onDismiss}
          className={clsxm("ml-auto rounded-md focus:ring-2 focus:ring-gray-300 p-1.5 inline-flex h-7 w-7 text-gray-500 hover:text-white bg-gray-800 hover:bg-gray-700", className)}
        >
          <span className="sr-only">Close</span>
          <FortIconClose className="w-4 h-4 fill-white" />
        </button>
      )}      
    </div>
  )
}
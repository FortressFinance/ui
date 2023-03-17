import { FC, PropsWithChildren } from "react"

import { Toast, ToastComponentProps } from "@/components/Toast"

import { FortIconClose } from "@/icons"

type NotificationToastComponentProps =
  PropsWithChildren<ToastComponentProps> & {
    title?: string
  }

export const NotificationToast: FC<NotificationToastComponentProps> = ({
  title,
  onDismiss,
  isVisible,
  children,
}) => {
  return (
    <Toast isVisible={isVisible} className="bg-pink-900 text-gray-300">
      <div className="mb-3 flex items-center">
        <span className="mb-1 text-sm font-semibold text-white">{title}</span>
        {!!onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-auto inline-flex h-7 w-7 rounded-md bg-pink-900 p-1.5 text-gray-500 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-gray-300"
          >
            <span className="sr-only">Close</span>
            <FortIconClose className="h-4 w-4 fill-white" />
          </button>
        )}
      </div>
      <div className="flex items-center">{children}</div>
    </Toast>
  )
}

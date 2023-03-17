import { FC, PropsWithChildren } from "react"

import { Toast,ToastComponentProps } from "@/components/Toast"

import { FortIconClose } from "@/icons"


type NotificationToastComponentProps = PropsWithChildren<ToastComponentProps> & {
  title?: string
}

export const NotificationToast: FC<NotificationToastComponentProps> = ({
  title,
  onDismiss,
  isVisible,
  children
}) => { 
  return (
    <Toast isVisible={isVisible} className="bg-pink-900 text-gray-300">
      <div className="flex items-center mb-3">
        <span className="mb-1 text-sm font-semibold text-white">{title}</span>
        { !!onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-auto rounded-md focus:ring-2 focus:ring-gray-300 p-1.5 inline-flex h-7 w-7 text-gray-500 hover:text-white bg-pink-900 hover:bg-gray-700"
          >
            <span className="sr-only">Close</span>
            <FortIconClose className="w-4 h-4 fill-white" />
          </button>
        )}     
      </div>
      <div className="flex items-center">
          {children}
      </div>
    </Toast>
  )
}
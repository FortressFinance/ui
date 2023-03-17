import { FC, PropsWithChildren } from "react"

import { Toast, ToastComponentProps } from "@/components/Toast"

import { FortIconWarning } from "@/icons"

export const ErrorToast: FC<PropsWithChildren<ToastComponentProps>> = ({
  onDismiss,
  isVisible,
  children,
}) => {
  return (
    <Toast
      isVisible={isVisible}
      className="flex items-center bg-red-500 text-white"
      onDismiss={onDismiss}
    >
      <div className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-red-800">
        <FortIconWarning className="col-span-full row-span-full h-5 w-5 fill-white" />
      </div>
      <div className="text-md ml-3 font-normal">{children}</div>
    </Toast>
  )
}

import { FC, PropsWithChildren } from "react"

import { Toast,ToastComponentProps } from "@/components/Toast"

import { FortIconCheck } from "@/icons"


export const SuccessToast: FC<PropsWithChildren<ToastComponentProps>> = ({
  onDismiss,
  isVisible,
  children
}) => { 
  return (
    <Toast isVisible={isVisible} className="bg-green-500 text-white flex items-center" onDismiss={onDismiss}>
      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg bg-green-800">
        <FortIconCheck className="col-span-full row-span-full h-5 w-5 fill-white" />
      </div>
      <div className="ml-3 text-md font-normal">{children}</div>
    </Toast>
  )
}
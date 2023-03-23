import { FC } from "react"

import Spinner from "@/components/Spinner"
import { Toast, TransactionToastComponentProps } from "@/components/Toast"

export const LoadingToast: FC<TransactionToastComponentProps> = ({
  message,
  isVisible,
}) => {
  return (
    <Toast isVisible={isVisible} className="flex items-center">
      <div className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg">
        <Spinner className="col-span-full row-span-full h-5 w-5" />
      </div>
      <div className="ml-3 mr-5 font-semibold max-md:text-sm max-md:font-medium">
        {message}
      </div>
    </Toast>
  )
}

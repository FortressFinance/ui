import { FC } from "react"

import Spinner from "@/components/Spinner"
import { Toast, TransactionToastComponentProps } from "@/components/Toast"

export const LoadingToast: FC<TransactionToastComponentProps> = ({
  message = "Loading...",
  isVisible,
}) => {
  return (
    <Toast
      isVisible={isVisible}
      className="flex items-center bg-sky-500 text-white"
    >
      <div className="text-blue-500 bg-blue-100 dark:bg-blue-800 dark:text-blue-200 inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg">
        <Spinner className="fill-white col-span-full row-span-full h-5 w-5" />
      </div>
      <div className="text-md ml-3 font-normal">{message}</div>
    </Toast>
  )
}

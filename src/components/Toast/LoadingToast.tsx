import { FC, PropsWithChildren } from "react"

import Spinner from "@/components/Spinner"
import { Toast,ToastComponentProps } from "@/components/Toast"


type LoadingToastComponentProps = ToastComponentProps & {
  text?: string
}

export const LoadingToast: FC<PropsWithChildren<LoadingToastComponentProps>> = ({
  text = "Loading...",
  isVisible
}) => { 
  return (
    <Toast isVisible={isVisible} className="bg-sky-500 text-white flex items-center ">
      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-blue-500 bg-blue-100 rounded-lg dark:bg-blue-800 dark:text-blue-200">
        <Spinner className="col-span-full row-span-full h-5 w-5 white" />
      </div>
      <div className="ml-3 text-md font-normal">{text}</div>
    </Toast>
  )
}
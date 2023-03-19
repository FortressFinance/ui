import Link from "next/link"
import { FC } from "react"
import toast from "react-hot-toast"

import { Toast,TransactionToastComponentProps } from "@/components/Toast"

import { FortIconCheck } from "@/icons"

export const SuccessToast: FC<TransactionToastComponentProps> = ({
  message,
  txHash,
  ...toastProps
}) => {
  return (
    <Toast
      className="flex items-center bg-green-500 text-white"
      onDismiss={() => toast.dismiss(txHash)}
      {...toastProps}
    >
      <div className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-green-800">
        <FortIconCheck className="col-span-full row-span-full h-5 w-5 fill-white" />
      </div>
      <div className="text-base ml-3 font-normal">
        <div className="grid grid-rows-2">
          <div>{message}</div>
          <div>
            <Link
              className="text-sm underline underline-offset-4"
              href={`https://arbiscan.io/tx/${txHash}`}
              target="_blank"
            >
              View on Explorer
            </Link>
          </div>
        </div>
      </div>
    </Toast>
  )
}

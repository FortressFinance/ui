import Link from "next/link"
import { FC } from "react"
import { toast } from "react-hot-toast"
import { useNetwork } from "wagmi"

import { Toast, TransactionToastComponentProps } from "@/components/Toast"

import { FortIconClose, FortIconWarning } from "@/icons"

export const ErrorToast: FC<TransactionToastComponentProps> = ({
  message,
  txHash,
  ...toastProps
}) => {
  const { chain } = useNetwork()
  return (
    <Toast
      className="flex items-center bg-pink-900/95 text-white"
      {...toastProps}
    >
      <div className="flex">
        <div className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-green-800">
          <FortIconWarning className="col-span-full row-span-full h-5 w-5 fill-white" />
        </div>
        <div className="ml-3">
          <div className="grid grid-rows-2">
            <div>{message}</div>
            <div>
              <Link
                className="text-sm underline underline-offset-4"
                href={`${chain?.blockExplorers?.default.url}/tx/${txHash}`}
                target="_blank"
              >
                View on explorer
              </Link>
            </div>
          </div>
        </div>
        <button
          onClick={() => toast.dismiss(txHash)}
          className="ml-auto inline-flex h-7 w-7 rounded-md bg-gray-800 p-1.5 text-gray-500 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-gray-300"
        >
          <span className="sr-only">Close</span>
          <FortIconClose className="h-4 w-4 fill-white" />
        </button>
      </div>
    </Toast>
  )
}

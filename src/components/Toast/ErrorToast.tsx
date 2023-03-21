import Link from "next/link"
import { FC } from "react"
import { useNetwork } from "wagmi"

import { Toast, TransactionToastComponentProps } from "@/components/Toast"

import { FortIconClose, FortIconWarning } from "@/icons"

export const ErrorToast: FC<TransactionToastComponentProps> = ({
  message,
  txHash,
  onDismiss,
  ...toastProps
}) => {
  const { chain } = useNetwork()
  return (
    <Toast className="bg-pink-900 text-white" {...toastProps}>
      <div className="flex">
        <div className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center">
          <FortIconWarning className="col-span-full row-span-full h-5 w-5 fill-red-500" />
        </div>
        <div className="ml-3">
          <span className="mb-1 text-sm">{message}</span>
          <div className="mb-2">
            <Link
              className="text-xs underline underline-offset-4"
              href={`${chain?.blockExplorers?.default.url}/tx/${txHash}`}
              target="_blank"
            >
              View on explorer
            </Link>
          </div>
        </div>
        {!!onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-auto inline-flex h-7 w-7 rounded-md p-1.5 align-top"
          >
            <span className="sr-only">Close</span>
            <FortIconClose className="h-4 w-4 fill-white" />
          </button>
        )}
      </div>
    </Toast>
  )
}

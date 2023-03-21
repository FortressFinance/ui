import { FC } from "react"
import toast from "react-hot-toast"

import { Toast, TransactionToastComponentProps } from "@/components/Toast"

import { FortIconCheck, FortIconClose } from "@/icons"

export const SuccessToast: FC<TransactionToastComponentProps> = ({
  message,
  txHash,
  ...toastProps
}) => {
  //const { chain } = useNetwork()
  return (
    <>
      <div
        id="toast-interactive"
        className="w-full max-w-xs rounded-lg bg-white p-4 text-gray-500 shadow dark:bg-gray-800 dark:text-gray-400"
        role="alert"
      >
        <div className="flex">
          <div className="text-blue-500 bg-blue-100 dark:text-blue-300 dark:bg-blue-900 inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg">
            <svg
              aria-hidden="true"
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <span className="sr-only">Refresh icon</span>
          </div>
          <div className="ml-3 text-sm font-normal">
            <span className="mb-1 text-sm font-semibold text-gray-900 dark:text-white"></span>
          </div>
          <button
            type="button"
            className="-mx-1.5 -my-1.5 ml-auto inline-flex h-8 w-8 rounded-lg bg-white p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-900 focus:ring-2 focus:ring-gray-300 dark:bg-gray-800 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-white"
            data-dismiss-target="#toast-interactive"
            aria-label="Close"
          >
            <span className="sr-only">Close</span>
            <svg
              aria-hidden="true"
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
      </div>
      <Toast
        className="flex items-center bg-pink-900/95 text-white"
        {...toastProps}
      >
        <div className="flex">
          <div className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-green-500">
            <FortIconCheck className="col-span-full row-span-full h-5 w-5 fill-white" />
          </div>
          <div className="ml-3">
            <span className="mb-1">{message}</span>
            <div className="mb-2 text-sm font-normal"></div>
          </div>
          <button
            onClick={() => toast.dismiss(txHash)}
            className="ml-auto inline-flex h-7 w-7 rounded-md p-1.5 align-top text-gray-500 hover:bg-gray-500 hover:text-white focus:ring-2 focus:ring-gray-300"
          >
            <span className="sr-only">Close</span>
            <FortIconClose className="h-4 w-4 fill-white" />
          </button>
        </div>
      </Toast>
    </>
  )
}

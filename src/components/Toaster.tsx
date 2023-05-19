import * as ToastPrimitive from "@radix-ui/react-toast"
import Link from "next/link"
import { FC, useCallback, useEffect, useRef, useState } from "react"
import { FaSignature } from "react-icons/fa"
import { useHoverDirty } from "react-use"
import { UserRejectedRequestError } from "viem"
import { useNetwork, useWaitForTransaction } from "wagmi"
import { shallow } from "zustand/shallow"

import clsxm from "@/lib/clsxm"

import Spinner from "@/components/Spinner"

import {
  FortIconCheck,
  FortIconClose,
  FortIconExternalLink,
  FortIconWarning,
} from "@/icons"

import { Toast, useToastStore } from "@/store"

export const Toaster: FC<{ className?: string }> = ({ className }) => {
  const toasts = useToastStore((state) => state.toasts)
  return (
    <>
      <ToastPrimitive.Viewport
        className={clsxm(
          "fixed inset-x-3 bottom-9 z-50 flex flex-col gap-1.5 md:left-1/2 md:right-auto md:w-full md:max-w-sm md:-translate-x-1/2 lg:bottom-auto lg:left-auto lg:right-4 lg:top-2.5 lg:translate-x-0 xl:left-1/2 xl:translate-x-48",
          className
        )}
      />

      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </>
  )
}

const DURATION = 7000

const Toast: FC<Toast> = (toast) => {
  const { chain } = useNetwork()

  const dismissTimer = useRef<NodeJS.Timer>()
  const [dismissToast, replaceToast] = useToastStore(
    (state) => [state.dismissToast, state.replaceToast],
    shallow
  )
  const toastRoot = useRef<HTMLLIElement>(null)
  const isHovered = useHoverDirty(toastRoot)

  const toastClass =
    toast.type === "errorWrite" || toast.type === "errorTx"
      ? "error"
      : toast.type === "startTx" || toast.type === "waitTx"
      ? "wait"
      : toast.type === "successTx"
      ? "success"
      : ""

  const isDismissable = toastClass === "error" || toastClass === "success"
  const [isUnmounting, setIsUnmounting] = useState<boolean>(false)
  const [timerStarted, setTimerStarted] = useState<number>(0)
  const [durationRemaining, setDurationRemaining] = useState<number>(DURATION)

  const dismissSelf = useCallback(() => {
    setIsUnmounting(true)
    setTimeout(() => dismissToast(toast.id), 300)
  }, [dismissToast, toast.id])

  useEffect(() => {
    if (isDismissable) {
      setTimerStarted(Date.now())
      dismissTimer.current = setTimeout(dismissSelf, DURATION)
    } else {
      clearTimeout(dismissTimer.current)
      dismissTimer.current = undefined
    }
    return () => {
      clearTimeout(dismissTimer.current)
    }
  }, [dismissSelf, isDismissable])
  useEffect(() => {
    if (isDismissable) {
      if (isHovered) {
        setDurationRemaining(durationRemaining - (Date.now() - timerStarted))
        clearTimeout(dismissTimer.current)
      } else {
        setTimerStarted(Date.now())
        dismissTimer.current = setTimeout(dismissSelf, durationRemaining)
      }
    } else {
      clearTimeout(dismissTimer.current)
      dismissTimer.current = undefined
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dismissSelf, isHovered])

  const waitForTxEnabled = toast.type === "waitTx"
  useWaitForTransaction({
    hash: waitForTxEnabled ? toast.hash : "0x",
    enabled: waitForTxEnabled,
    // TODO: wagmiv1 onSuccess
    onSuccess: (receipt) =>
      replaceToast(toast.id, {
        type: "successTx",
        action: toast.action,
        hash: receipt.transactionHash,
      }),
    onError: () =>
      replaceToast(toast.id, { type: "errorTx", action: toast.action }),
  })

  return (
    <ToastPrimitive.Root
      ref={toastRoot}
      open={!isUnmounting}
      className={clsxm(
        "flex w-full items-start gap-3 rounded-md bg-gradient-radial from-[#61312A] to-[#5D2741] p-4 text-sm text-white shadow-lg shadow-black/50 ui-state-closed:animate-scale-out ui-state-open:animate-scale-in md:max-w-sm md:text-base md:shadow-black/25 lg:shadow",
        { "text-red-500": toastClass === "error" },
        { "text-orange-500": toastClass === "wait" },
        { "text-[#548b97]": toastClass === "success" }
      )}
      duration={Infinity}
    >
      {toast.type === "errorWrite" || toast.type === "errorTx" ? (
        <FortIconWarning className="h-6 w-6 flex-shrink-0 fill-current" />
      ) : toast.type === "startTx" ? (
        <FaSignature className="h-6 w-6 flex-shrink-0 fill-current" />
      ) : toast.type === "successTx" ? (
        <FortIconCheck className="h-6 w-6 flex-shrink-0 fill-current" />
      ) : toast.type === "waitTx" ? (
        <Spinner className="h-6 w-6 flex-shrink-0 fill-current" />
      ) : null}

      <ToastPrimitive.Description className="w-full text-white/90">
        {toast.type === "errorWrite"
          ? toast.error instanceof UserRejectedRequestError
            ? "User rejected request"
            : "Error broadcasting transaction"
          : toast.type === "errorTx"
          ? `${toast.action} unsuccessful`
          : toast.type === "successTx"
          ? `${toast.action} successful`
          : toast.type === "waitTx"
          ? `Waiting for ${toast.action?.toLowerCase()} confirmation`
          : toast.type === "startTx"
          ? `Waiting for user signature to authorize ${toast.action?.toLowerCase()}`
          : ""}

        {(toast.type === "successTx" || toast.type === "waitTx") && (
          <div>
            <Link
              className="underline-offset-3 mt-2 inline-flex items-center gap-1 text-sm text-white/50 hover:underline"
              href={`${chain?.blockExplorers?.default.url}/tx/${toast.hash}`}
              target="_blank"
            >
              <span>View on {chain?.blockExplorers?.default.name}</span>
              <FortIconExternalLink className="h-3 w-3 opacity-75" />
            </Link>
          </div>
        )}
      </ToastPrimitive.Description>

      {isDismissable && (
        <ToastPrimitive.Close
          className="-mr-0.5 justify-self-end p-1"
          onClick={dismissSelf}
        >
          <FortIconClose className="h-4 w-4 fill-white/50" />
        </ToastPrimitive.Close>
      )}
    </ToastPrimitive.Root>
  )
}

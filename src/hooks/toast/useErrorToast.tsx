import { PropsWithChildren } from "react"
import toast from "react-hot-toast"
import { v4 as uuid } from "uuid"

import { ToastProps } from "@/hooks/toast/useLoadingToast"

import { ErrorToast } from "@/components/Toast"

type ErrorToastProps = PropsWithChildren<ToastProps>

export function useErrorToast({
  position,
  duration,
  children,
}: ErrorToastProps) {
  const fireToast = () => {
    const id = uuid()
    const dismiss = () => toast.dismiss(id)
    toast.custom(
      (t) => (
        <ErrorToast isVisible={t.visible} onDismiss={dismiss}>
          {children}
        </ErrorToast>
      ),
      { id, duration, position }
    )
  }
  return fireToast
}

export function useDefaultErrorToast({
  children,
}: {
  children: ErrorToastProps["children"]
}) {
  return useErrorToast({
    children,
    position: "top-right",
    duration: 7000, // 7 sec
  })
}

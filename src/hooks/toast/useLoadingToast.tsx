import { ReactNode } from "react"
import toast from "react-hot-toast"

import { ErrorToast, LoadingToast, SuccessToast } from "@/components/Toast"

export type ToastProps = {
  position:
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right"
  duration: number
}

type LoadingToastProps = ToastProps & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSuccess: (t: any) => ReactNode
  onError: (e: Error) => ReactNode
}

export function useLoadingToast<T>(
  promise: Promise<T>,
  { position, duration, onSuccess, onError }: LoadingToastProps
) {
  const fireToast = () => {
    const id = toast.custom((t) => <LoadingToast isVisible={t.visible} />, {
      position,
    })

    const dismiss = () => toast.dismiss(id)

    promise
      .then((p) => {
        toast.custom(
          (t) => (
            <SuccessToast isVisible={t.visible} onDismiss={dismiss}>
              {onSuccess(p)}
            </SuccessToast>
          ),
          { id, duration, position }
        )
        return p
      })
      .catch((e) => {
        toast.custom(
          (t) => (
            <ErrorToast isVisible={t.visible} onDismiss={dismiss}>
              {onError(e)}
            </ErrorToast>
          ),
          { id, duration, position }
        )
      })

    return promise
  }
  return fireToast
}

export function useDefaultLoadingToast<T>(
  promise: Promise<T>,
  {
    onSuccess,
    onError,
  }: {
    onSuccess: LoadingToastProps["onSuccess"]
    onError: LoadingToastProps["onError"]
  }
) {
  return useLoadingToast(promise, {
    onSuccess,
    onError,
    position: "top-right",
    duration: 7000, // 7 sec
  })
}

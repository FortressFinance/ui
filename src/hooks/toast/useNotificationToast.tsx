import { PropsWithChildren } from "react"
import toast from "react-hot-toast"
import { v4 as uuid } from "uuid"

import { ToastProps } from "@/hooks/toast/useLoadingToast"

import { NotificationToast } from "@/components/Toast"

type NotificationToastProps = PropsWithChildren<ToastProps> & {
  title?: string
}

export function useNotificationToast({
  title,
  position,
  duration,
  children,
}: NotificationToastProps) {
  const fireToast = () => {
    const id = uuid()
    const dismiss = () => toast.dismiss(id)
    toast.custom(
      (t) => (
        <NotificationToast
          isVisible={t.visible}
          onDismiss={dismiss}
          title={title}
        >
          {children}
        </NotificationToast>
      ),
      { id, duration, position }
    )
  }
  return fireToast
}

export function useDefaultNotificationToast({
  title,
  children,
}: {
  title: NotificationToastProps["title"]
  children: NotificationToastProps["children"]
}) {
  return useNotificationToast({
    title,
    children,
    position: "top-right",
    duration: 7000 // 7 sec
  })
}

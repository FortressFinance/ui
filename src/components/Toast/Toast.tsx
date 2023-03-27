import { FC, PropsWithChildren } from "react"

import clsxm from "@/lib/clsxm"

export type ToastComponentProps = {
  isVisible: boolean
  className?: string
  onDismiss?: () => void
}

export type TransactionToastComponentProps = ToastComponentProps & {
  message: string
  txHash?: string
}

export const Toast: FC<PropsWithChildren<ToastComponentProps>> = ({
  className,
  children,
}) => {
  return (
    <div
      className={clsxm(
        "w-full max-w-sm rounded-md bg-gradient-radial from-[#61312A] to-[#5D2741] p-4 text-white shadow",
        className
      )}
    >
      {children}
    </div>
  )
}

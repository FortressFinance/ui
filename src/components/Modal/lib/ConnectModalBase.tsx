import { FC, PropsWithChildren } from "react"

import ModalBase, { ModalBaseProps } from "@/components/Modal/lib/ModalBase"

export const ConnectModalBase: FC<PropsWithChildren<ModalBaseProps>> = ({
  children,
  ...modalProps
}) => {
  return (
    <ModalBase {...modalProps}>
      <div className="relative mx-auto w-full max-w-md rounded border border-orange/50 bg-gradient-to-tr from-pink-600 to-orange-600 p-3 py-6 sm:p-6">
        {children}
      </div>
    </ModalBase>
  )
}

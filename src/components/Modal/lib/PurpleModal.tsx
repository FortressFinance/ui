import { Dialog } from "@headlessui/react"
import { FC, PropsWithChildren } from "react"

import clsxm from "@/lib/clsxm"

import ModalBase, { ModalBaseProps } from "@/components/Modal/lib/ModalBase"

type PurpleModalProps = ModalBaseProps & {
  className?: string
}

const PurpleModal: FC<PropsWithChildren<PurpleModalProps>> = ({
  children,
  className,
  ...modalProps
}) => (
  <ModalBase {...modalProps}>
    <Dialog.Panel
      className={clsxm(
        "w-full rounded-lg border border-pink-700 bg-pink-900",
        className
      )}
    >
      {children}
    </Dialog.Panel>
  </ModalBase>
)

export default PurpleModal

type PurpleModalBlockProps = {
  className?: string
}

export const PurpleModalHeader: FC<
  PropsWithChildren<PurpleModalBlockProps>
> = ({ children, className }) => (
  <header className={clsxm("border-b border-b-pink-800 p-3 md:p-5", className)}>
    {children}
  </header>
)

export const PurpleModalContent: FC<
  PropsWithChildren<PurpleModalBlockProps>
> = ({ children, className }) => (
  <div className={clsxm("p-3 md:p-5", className)}>{children}</div>
)

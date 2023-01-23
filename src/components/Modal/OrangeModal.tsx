import { Dialog } from "@headlessui/react"
import { FC, PropsWithChildren } from "react"

import ModalBase, { ModalBaseProps } from "@/components/Modal/ModalBase"

const OrangeModal: FC<PropsWithChildren<ModalBaseProps>> = ({
  children,
  ...modalProps
}) => {
  return (
    <ModalBase {...modalProps}>
      <Dialog.Panel className="relative mx-auto grid min-h-screen w-full grid-cols-1 grid-rows-[1fr,minmax(max-content,auto),1fr] border border-pink-400 bg-gradient-to-br from-orange-600 to-pink-600 p-4 sm:min-h-0 sm:max-w-md sm:grid-rows-1 sm:rounded-lg sm:p-7 sm:pb-10">
        {children}
      </Dialog.Panel>
    </ModalBase>
  )
}

export default OrangeModal

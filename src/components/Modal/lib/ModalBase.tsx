import * as Dialog from "@radix-ui/react-dialog"
import { FC, PropsWithChildren } from "react"

export type ModalBaseProps = {
  isOpen: boolean
  onClose: () => void
}

// Mostly unstyled base for modal windows
// Controls positioning, scrolling, backdrop, animation
// Wrap panel style variants with this component for full modal functionality

const ModalBase: FC<PropsWithChildren<ModalBaseProps>> = ({
  children,
  isOpen,
  onClose,
}) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 h-screen overflow-y-auto bg-pink-900 bg-opacity-60 backdrop-blur ui-state-closed:animate-fade-out ui-state-open:animate-fade-in">
          <div className="flex min-h-full w-full items-center justify-center p-3 sm:p-4">
            <Dialog.Content asChild>{children}</Dialog.Content>
          </div>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default ModalBase

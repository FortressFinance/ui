import { Dialog, Transition } from "@headlessui/react"
import { FC, Fragment, PropsWithChildren } from "react"

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
    <Transition show={isOpen}>
      <Dialog onClose={onClose} open={isOpen} static>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="transition-all duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-60"
          leave="transition-all duration-200"
          leaveFrom="opacity-60"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 z-10 bg-black" />
        </Transition.Child>

        {/* Scrollable container for modal dialog */}
        <Transition.Child
          as={Fragment}
          enter="transition-all duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-all duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 z-10 overflow-y-auto backdrop-blur">
            {/* Inner scrollarea */}
            <div className="flex min-h-full items-center justify-center sm:p-4">
              {children}
            </div>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  )
}

export default ModalBase

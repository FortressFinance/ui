import { Dialog } from "@headlessui/react"
import { AnimatePresence, easeInOut, motion, MotionConfig } from "framer-motion"
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
    <MotionConfig transition={{ duration: 0.2, ease: easeInOut }}>
      <AnimatePresence>
        {isOpen && (
          <Dialog as={motion.div} onClose={onClose} open={isOpen} static>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-10 bg-black"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
            />

            {/* Scrollable container for modal dialog */}
            <motion.div
              className="fixed inset-0 z-10 overflow-y-auto backdrop-blur"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Inner scrollarea */}
              <div className="flex min-h-full items-center justify-center sm:p-4">
                {children}
              </div>
            </motion.div>
          </Dialog>
        )}
      </AnimatePresence>
    </MotionConfig>
  )
}

export default ModalBase

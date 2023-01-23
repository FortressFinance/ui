import { Portal } from "@headlessui/react"
import { AnimatePresence, easeInOut, motion } from "framer-motion"
import {
  Children,
  cloneElement,
  FC,
  PropsWithChildren,
  useCallback,
  useRef,
  useState,
} from "react"
import { usePopper } from "react-popper"

import Triangle from "~/svg/icons/triangle.svg"

type TooltipProps = {
  label: string
}

const Tooltip: FC<PropsWithChildren<TooltipProps>> = ({ children, label }) => {
  const enterTimeout = useRef<NodeJS.Timeout | null>(null)

  const [isOpen, setIsOpen] = useState(false)
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(
    null
  )
  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null)
  const [arrowElement, setArrowElement] = useState<HTMLElement | null>(null)

  const onOpen = useCallback(() => {
    if (enterTimeout.current) clearTimeout(enterTimeout.current)
    setIsOpen(true)
  }, [])
  const onMouseEnter = useCallback(() => {
    if (!enterTimeout.current) {
      enterTimeout.current = setTimeout(onOpen, 300)
    }
  }, [onOpen])
  const onMouseLeave = useCallback(() => {
    if (enterTimeout.current) {
      clearTimeout(enterTimeout.current)
      enterTimeout.current = null
    }
    setIsOpen(false)
  }, [setIsOpen])

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "top",
    strategy: "fixed",
    modifiers: [
      { name: "preventOverflow", options: { padding: 8 } },
      { name: "offset", options: { offset: [-8, 16] } },
      { name: "arrow", options: { element: arrowElement } },
    ],
  })

  const child = Children.only(children) as React.ReactElement & {
    ref?: React.Ref<any>
  }

  return (
    <>
      {cloneElement(child, {
        onMouseEnter,
        onMouseLeave,
        ref: setReferenceElement,
      })}

      <AnimatePresence>
        {isOpen && (
          <Portal>
            <motion.div
              ref={setPopperElement}
              className="z-20 rounded-md bg-blue py-2 px-4 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, ease: easeInOut }}
              style={styles.popper}
              {...attributes.popper}
            >
              <span className="-translate-y-4">{label}</span>
              <span
                ref={setArrowElement}
                style={styles.arrow}
                {...attributes.arrow}
              >
                <Triangle className="h-4 w-4 translate-y-6 fill-blue" />
              </span>
            </motion.div>
          </Portal>
        )}
      </AnimatePresence>
    </>
  )
}

export default Tooltip

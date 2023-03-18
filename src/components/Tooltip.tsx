import { Transition } from "@headlessui/react"
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

import Triangle from "~/svg/triangle.svg"

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
      { name: "offset", options: { offset: [0, 16] } },
      { name: "arrow", options: { element: arrowElement } },
    ],
  })

  const child = Children.only(children) as React.ReactElement & {
    ref?: React.Ref<unknown>
  }

  return (
    <>
      {cloneElement(child, {
        onMouseEnter,
        onMouseLeave,
        ref: setReferenceElement,
      })}

      <Transition
        as="div"
        className="fixed max-md:hidden"
        show={isOpen}
        enter="transition-opacity duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div
          ref={setPopperElement}
          className="z-20 max-w-xs rounded-lg bg-blue py-2 px-4 text-center text-sm"
          style={styles.popper}
          {...attributes.popper}
        >
          <span className="-translate-y-4">{label}</span>
          <span
            ref={setArrowElement}
            style={styles.arrow}
            {...attributes.arrow}
          >
            <Triangle className="h-3 w-6 translate-y-6 fill-blue" />
          </span>
        </div>
      </Transition>
    </>
  )
}

export default Tooltip

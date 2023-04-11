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

import clsxm from "@/lib/clsxm"

import Triangle from "~/svg/triangle.svg"

type TooltipProps = {
  label: string
}

const Tooltip: FC<PropsWithChildren<TooltipProps>> = ({ children, label }) => {
  const enterTimeout = useRef<NodeJS.Timeout | null>(null)
  const exitTimeout = useRef<NodeJS.Timeout | null>(null)

  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(
    null
  )
  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null)
  const [arrowElement, setArrowElement] = useState<HTMLElement | null>(null)

  const onOpen = useCallback(() => {
    if (enterTimeout.current) clearTimeout(enterTimeout.current)
    setIsOpen(true)
    setIsMounted(true)
  }, [])
  const onMouseEnter = useCallback(() => {
    if (exitTimeout.current) {
      clearTimeout(exitTimeout.current)
      exitTimeout.current = null
    }
    if (!enterTimeout.current) enterTimeout.current = setTimeout(onOpen, 300)
  }, [onOpen])
  const onMouseLeave = useCallback(() => {
    if (enterTimeout.current) {
      clearTimeout(enterTimeout.current)
      enterTimeout.current = null
    }
    setIsOpen(false)
    exitTimeout.current = setTimeout(() => setIsMounted(false), 200)
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
      {isMounted && (
        <div className="fixed">
          <div
            ref={setPopperElement}
            className={clsxm(
              "z-20 max-w-sm rounded-lg bg-blue px-4 py-2 text-center text-sm font-normal text-white",
              {
                "animate-fade-in": isOpen,
                "animate-fade-out": !isOpen,
              }
            )}
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
        </div>
      )}
    </>
  )
}

export default Tooltip

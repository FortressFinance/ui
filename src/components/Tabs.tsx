import { Tab } from "@headlessui/react"
import { FC, forwardRef, PropsWithChildren, ReactNode } from "react"

import clsxm from "@/lib/clsxm"

export const TabList = forwardRef<HTMLDivElement>((props, ref) => (
  <div className="flex gap-4 max-md:grow" ref={ref} {...props} />
))

export const TabListGroup: FC<PropsWithChildren<{ className?: string }>> = ({
  className,
  ...props
}) => (
  <div
    className={clsxm(
      "flex overflow-hidden rounded-md border border-pink/30 bg-pink-900/80 backdrop-blur-md max-md:grow max-md:flex-wrap",
      className
    )}
    {...props}
  />
)

export const TabButton = forwardRef<
  HTMLButtonElement,
  Parameters<typeof Tab>[0] & { children: ReactNode }
>(({ children, className, ...props }, ref) => {
  return (
    <button
      className={clsxm(
        "transition-color py-2 px-4 duration-200 hover:bg-white hover:text-pink-900 ui-selected:bg-white ui-selected:text-pink-900 max-md:grow md:py-3 md:px-6",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  )
})

export const TabPanels = forwardRef<HTMLDivElement>((props, ref) => (
  <div className="mt-4" ref={ref} {...props} />
))

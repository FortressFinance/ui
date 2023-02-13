import { Tab } from "@headlessui/react"
import { FC, forwardRef, PropsWithChildren, ReactNode } from "react"

import clsxm from "@/lib/clsxm"

export const TabList = forwardRef<HTMLDivElement>((props, ref) => (
  <div className="flex grow gap-4" ref={ref} {...props} />
))

export const TabListGroup: FC<PropsWithChildren<{ className?: string }>> = ({ className, ...props }) => (
  <div
    className={clsxm("overflow-hidden flex grow flex-wrap rounded-md border-2 border-pink/30 bg-black/60",
      className)}
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
        "py-2 md:py-3 px-4 md:px-6 grow",
        {
          "bg-white text-black": props["aria-selected"] === true,
        },
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
  <div className="mt-6" ref={ref} {...props} />
))

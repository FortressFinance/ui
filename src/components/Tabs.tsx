import { Tab } from "@headlessui/react"
import { FC, forwardRef, PropsWithChildren, ReactNode } from "react"

import clsxm from "@/lib/clsxm"

export const TabList = forwardRef<HTMLDivElement>((props, ref) => (
  <div className="flex gap-4" ref={ref} {...props} />
))

export const TabListGroup: FC<PropsWithChildren> = (props) => (
  <div
    className="overflow-hidden rounded-md border-2 border-pink/30 bg-black/60"
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
        "py-3 px-6",
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

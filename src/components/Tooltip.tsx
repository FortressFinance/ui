import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { FC, PropsWithChildren, useState } from "react"

import { inter } from "@/lib/fonts"

type TooltipProps = PropsWithChildren<{
  label: string
}>

const Tooltip: FC<TooltipProps> = ({ children, label }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <TooltipPrimitive.Root open={isOpen}>
      <TooltipPrimitive.Trigger
        asChild
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
      >
        {children}
      </TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          className={`${inter.variable} z-50 max-w-sm rounded-lg bg-blue px-4 py-2 text-center font-sans text-sm font-normal text-white shadow-md ui-state-closed:animate-fade-out ui-state-delayed-open:animate-fade-in ui-state-open:animate-fade-in`}
          sideOffset={6}
        >
          {label}
          <TooltipPrimitive.Arrow className="h-2.5 w-5 fill-blue" />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  )
}

export default Tooltip

export const TooltipProvider: FC<PropsWithChildren> = ({ children }) => (
  <TooltipPrimitive.Provider delayDuration={300} skipDelayDuration={600}>
    {children}
  </TooltipPrimitive.Provider>
)

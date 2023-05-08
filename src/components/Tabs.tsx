import {
  ComponentPropsWithoutRef,
  FC,
  forwardRef,
  PropsWithChildren,
} from "react"

import clsxm from "@/lib/clsxm"

export const TabListGroup: FC<PropsWithChildren<{ className?: string }>> = ({
  className,
  ...props
}) => (
  <div
    className={clsxm(
      "rounded-lg border border-pink/30 bg-pink-900/80 backdrop-blur-md max-md:snap-x max-md:overflow-x-auto",
      className
    )}
  >
    <div className="flex overflow-visible" {...props} />
  </div>
)

export const TabButton = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<"button"> & { disabled?: boolean }
>(({ children, className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={clsxm(
        "transition-color px-6 py-3 duration-200 first:rounded-l-md last:rounded-r-md ui-state-active:bg-white ui-state-active:text-pink-900 max-md:snap-start md:hover:bg-white md:hover:text-pink-900",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
})

export const TabContent = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<"div">
>((props, ref) => (
  <div
    className="ui-state-active:animate-scale-in ui-state-inactive:absolute ui-state-inactive:inset-x-0 ui-state-inactive:top-0 ui-state-inactive:animate-scale-out"
    ref={ref}
    {...props}
  />
))

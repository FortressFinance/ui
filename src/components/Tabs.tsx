import {
  DetailedHTMLProps,
  FC,
  forwardRef,
  HTMLAttributes,
  PropsWithChildren,
} from "react"

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
      "rounded-lg border border-pink/30 bg-pink-900/80 backdrop-blur-md max-md:snap-x max-md:overflow-x-auto",
      className
    )}
  >
    <div className="flex overflow-visible" {...props} />
  </div>
)

export const TabButton = forwardRef<
  HTMLButtonElement,
  DetailedHTMLProps<HTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
    disabled?: boolean
  }
>(({ children, className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={clsxm(
        "transition-color px-6 py-3 duration-200 first:rounded-l-md last:rounded-r-md ui-selected:bg-white ui-selected:text-pink-900 max-md:snap-start md:hover:bg-white md:hover:text-pink-900",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
})

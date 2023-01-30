import clsx from "clsx"
import { FC, MouseEventHandler, PropsWithChildren } from "react"

import clsxm from "@/lib/clsxm"

type VaultTableNodeProps = {
  className?: string
}

type VaultTableRowProps = VaultTableNodeProps & {
  disabled?: boolean
  onClick?: MouseEventHandler<HTMLDivElement>
}

export const VaultTableRow: FC<PropsWithChildren<VaultTableRowProps>> = ({
  children,
  className,
  disabled,
  onClick,
}) => {
  const clickHandler: MouseEventHandler<HTMLDivElement> = (e) => {
    if (!disabled && onClick) onClick(e)
  }

  return (
    <div
      className={clsx(
        "relative grid grid-cols-[4fr,1fr,1fr,1fr,3.5rem] items-center gap-x-2 overflow-hidden rounded-md bg-black/60 p-3 text-xs backdrop-blur-md sm:text-sm md:gap-x-3 lg:px-6 lg:text-base",
        className
      )}
      role="row"
    >
      {children}

      {/* Make entire row clickable but without breaking accessibility */}
      {!!onClick && (
        <div
          className={clsxm("absolute inset-0 -z-[1] block", {
            "cursor-pointer": !disabled,
            "cursor-wait": disabled,
          })}
          onClick={clickHandler}
          aria-hidden="true"
        />
      )}
    </div>
  )
}

export const VaultTableHeader: FC<PropsWithChildren<VaultTableNodeProps>> = ({
  children,
  className,
}) => (
  <span className={clsx("text-sm", className)} role="rowheader">
    {children}
  </span>
)

export const VaultTableCell: FC<PropsWithChildren<VaultTableNodeProps>> = ({
  children,
  className,
}) => (
  <span className={clsx("", className)} role="cell">
    {children}
  </span>
)

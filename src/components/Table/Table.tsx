import clsx from "clsx"
import { FC, MouseEventHandler, PropsWithChildren } from "react"

import clsxm from "@/lib/clsxm"

export const Table: FC<PropsWithChildren> = ({ children }) => {
  return <div role="table">{children}</div>
}

type TableChildProps = {
  className?: string
}

type TableRowProps = TableChildProps & {
  disabled?: boolean
  onClick?: MouseEventHandler<HTMLDivElement>
}

export const TableRow: FC<PropsWithChildren<TableRowProps>> = ({
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

export const TableHeaderRow: FC<PropsWithChildren<TableRowProps>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div role="rowgroup">
      <TableRow
        className={clsxm(
          "rounded-b-none border-b-2 border-b-pink/30",
          className
        )}
        {...props}
      >
        {children}
      </TableRow>
    </div>
  )
}

export const TableBody: FC<PropsWithChildren<TableChildProps>> = ({
  children,
}) => {
  return (
    <div role="rowgroup" className="space-y-2">
      {children}
    </div>
  )
}

export const TableHeader: FC<PropsWithChildren<TableChildProps>> = ({
  children,
  className,
}) => (
  <span className={clsx("text-sm", className)} role="rowheader">
    {children}
  </span>
)

export const TableCell: FC<PropsWithChildren<TableChildProps>> = ({
  children,
  className,
}) => (
  <span className={clsx("", className)} role="cell">
    {children}
  </span>
)

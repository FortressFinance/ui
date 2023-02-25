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
        "relative items-center gap-x-2 overflow-hidden rounded-lg bg-pink-900/80 p-3 backdrop-blur-md md:grid md:grid-cols-[4fr,1fr,1fr,1fr,3.5rem] md:px-6",
        className
      )}
      role="row"
    >
      {children}

      {/* Make entire row clickable but without breaking accessibility */}
      {!!onClick && (
        <div
          className={clsxm("absolute inset-0 -z-[1] block max-md:hidden", {
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
          "rounded-b-none border-b border-b-pink/30 py-3",
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
  <div className={className} role="cell">
    {children}
  </div>
)

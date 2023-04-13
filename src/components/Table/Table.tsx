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
  showEarningsColumn?: boolean
}

export const TableRow: FC<PropsWithChildren<TableRowProps>> = ({
  children,
  className,
  disabled,
  onClick,
  showEarningsColumn = false,
}) => {
  const clickHandler: MouseEventHandler<HTMLDivElement> = (e) => {
    if (!disabled && onClick) onClick(e)
  }

  return (
    <div
      className={clsxm(
        "relative items-center gap-x-2 overflow-hidden rounded-lg bg-pink-900/80 p-3 backdrop-blur-md lg:grid lg:grid-cols-[4fr,1fr,1fr,1fr,3.5rem] lg:px-6",
        { "lg:grid-cols-[4fr,1fr,1fr,1fr,1fr,3.5rem]": showEarningsColumn },
        className
      )}
      role="row"
    >
      {children}

      {/* Make entire row clickable but without breaking accessibility */}
      {!!onClick && (
        <div
          className={clsxm("absolute inset-0 -z-[1] block max-lg:hidden", {
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
  <span className={className} role="rowheader">
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

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
  numberCols?: number
}

export const TableRow: FC<PropsWithChildren<TableRowProps>> = ({
  children,
  className,
  disabled,
  numberCols,
  onClick,
}) => {
  const clickHandler: MouseEventHandler<HTMLDivElement> = (e) => {
    if (!disabled && onClick) onClick(e)
  }

  return (
    <div
      className={clsx(
        "relative items-center gap-x-2 overflow-hidden rounded-lg bg-pink-900/80 p-3 backdrop-blur-md lg:grid lg:px-6",
        className,
        generateGridColumns(numberCols)
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

const FIRST_COLUMN_WIDTH = "4fr"
const MIDDLE_COLUMN_WIDTH = "1fr"
const LAST_COLUMN_WIDTH = "3.5rem"

function generateGridColumns(numColumns?: number): string {
  const nbColumns = numColumns === undefined || numColumns < 3 ? 6 : numColumns
  const middleColumnsWidths = Array(nbColumns - 2)
    .fill(MIDDLE_COLUMN_WIDTH)
    .join(",")
  return `lg:grid-cols-[${FIRST_COLUMN_WIDTH},${middleColumnsWidths},${LAST_COLUMN_WIDTH}]`
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

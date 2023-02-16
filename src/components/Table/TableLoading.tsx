import { FC, PropsWithChildren } from "react"

import Spinner from "@/components/Spinner"
import { TableRow } from "@/components/Table"

export const TableLoading: FC<PropsWithChildren> = ({ children }) => {
  return (
    <TableRow
      className="flex h-[88px] items-center rounded-t-none"
      aria-label={children}
    >
      <span className="col-span-full text-center" aria-hidden="true">
        <Spinner className="h-10 w-10" />
      </span>
    </TableRow>
  )
}

type TableEmptyProps = {
  heading: string
}

export const TableEmpty: FC<PropsWithChildren<TableEmptyProps>> = ({
  heading,
  children,
}) => {
  return (
    <TableRow className="flex h-48 items-center rounded-t-none">
      <div className="col-span-full">
        <h2 className="mb-3 text-center text-2xl font-semibold">{heading}</h2>
        <p className="mx-auto max-w-3xl text-center text-sm">{children}</p>
      </div>
    </TableRow>
  )
}

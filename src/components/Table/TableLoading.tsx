import { FC, PropsWithChildren } from "react"

import Spinner from "@/components/Spinner"
import { TableRow } from "@/components/Table"

export const TableLoading: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex h-52 place-items-center rounded-lg bg-pink-900/80 p-3 backdrop-blur-md md:grid md:h-24 md:rounded-t-none">
      <Spinner className="h-10 w-10" />
      <span className="sr-only">{children}</span>
    </div>
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
    <TableRow className="flex h-52 items-center justify-center p-3 md:flex md:h-48 md:rounded-t-none lg:flex">
      <div className="mx-auto max-w-2xl text-center text-sm md:text-base">
        <h2 className="mb-3 text-lg font-semibold md:text-xl">{heading}</h2>
        <p className="text-sm md:text-base">{children}</p>
      </div>
    </TableRow>
  )
}

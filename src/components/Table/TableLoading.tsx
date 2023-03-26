import { FC, PropsWithChildren, ReactNode } from "react"

import { ConnectButton } from "@/components/ConnectButton"
import Spinner from "@/components/Spinner"

export const TableLoading: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex h-52 items-center justify-center rounded-lg bg-pink-900/80 p-3 backdrop-blur-md md:grid md:h-24 md:rounded-t-none">
      <Spinner className="h-10 w-10" />
      <span className="sr-only">{children}</span>
    </div>
  )
}

type TableEmptyOrDisconnectedProps = {
  heading: string
  footing?: ReactNode
}

export const TableEmpty: FC<
  PropsWithChildren<TableEmptyOrDisconnectedProps>
> = ({ heading, children }) => {
  return <TableTemplate heading={heading}>{children}</TableTemplate>
}

export const TableDisconnected: FC<
  PropsWithChildren<TableEmptyOrDisconnectedProps>
> = ({ heading, children }) => {
  return (
    <TableTemplate
      heading={heading}
      footing={<ConnectButton className="col-span-full mt-3 w-72" />}
    >
      {children}
    </TableTemplate>
  )
}

const TableTemplate: FC<PropsWithChildren<TableEmptyOrDisconnectedProps>> = ({
  heading,
  children,
  footing,
}) => {
  return (
    <div className="flex h-52 items-center justify-center rounded-lg bg-pink-900/80 p-3 backdrop-blur-md md:grid md:h-48 md:rounded-t-none">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="mb-3 text-lg font-semibold md:text-xl">{heading}</h2>
        <p className="text-sm md:text-base">{children}</p>
        {footing}
      </div>
    </div>
  )
}

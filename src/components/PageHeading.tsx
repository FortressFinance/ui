import { FC, PropsWithChildren } from "react"

export const PageHeading: FC<PropsWithChildren> = ({ children }) => {
  return <h1 className="mb-4 font-display text-4xl md:mb-6">{children}</h1>
}

import { FC, PropsWithChildren } from "react"

export const PageHeading: FC<PropsWithChildren> = ({ children }) => {
  return <h1 className="mb-4 md:mb-6 font-display text-4xl">{children}</h1>
}

import { FC, PropsWithChildren } from "react"

export const PageHeading: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="mb-4 flex items-center justify-between md:mb-6">
      {children}
    </div>
  )
}

export const PageHeadingTitle: FC<PropsWithChildren> = ({ children }) => {
  return <h1 className="font-display text-4xl">{children}</h1>
}

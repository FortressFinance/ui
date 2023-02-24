import { FC, PropsWithChildren } from "react"

export const GradientText: FC<PropsWithChildren> = ({ children }) => {
  return (
    <span className="bg-gradient-to-r from-orange to-pink bg-clip-text text-transparent">
      {children}
    </span>
  )
}

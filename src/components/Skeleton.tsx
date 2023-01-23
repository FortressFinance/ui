import clsx from "clsx"
import { FC, PropsWithChildren } from "react"

type SkeletonProps = {
  isLoading: boolean
}

const Skeleton: FC<PropsWithChildren<SkeletonProps>> = ({
  children,
  isLoading,
}) => {
  return (
    <span
      className={clsx({
        "animate-pulse bg-white/20 text-transparent": isLoading,
      })}
    >
      {children}
    </span>
  )
}

export default Skeleton

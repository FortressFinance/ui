import clsx from "clsx"
import { FC, PropsWithChildren } from "react"

import { useClientReady } from "@/hooks"

type SkeletonProps = {
  className?: string
  isLoading: boolean
  loadingText?: string
}

const Skeleton: FC<PropsWithChildren<SkeletonProps>> = ({
  children,
  className = "",
  isLoading,
  loadingText = "Loading",
}) => {
  const isClientReady = useClientReady()
  return (
    <span
      className={clsx(
        {
          "animate-pulse bg-white/20 text-transparent":
            !isClientReady || isLoading,
        },
        className
      )}
    >
      {!isClientReady || isLoading ? loadingText : children}
    </span>
  )
}

export default Skeleton

import { FC } from "react"

import clsxm from "@/lib/clsxm"

import Tooltip from "@/components/Tooltip"

import { useQueryStatusStore } from "@/store"

type FallbackSignalProps = {
  className?: string
  showTooltip?: boolean
  showLabels?: boolean
}

const FallbackSignal: FC<FallbackSignalProps> = ({
  className,
  showLabels = true,
}) => {
  const failedQueries = useQueryStatusStore((state) => state.queryStatus)
  const failedQueriesCount = failedQueries.size
  const isMinorInterruption = failedQueriesCount >= 1 && failedQueriesCount <= 3
  const isCriticalInterruption = failedQueriesCount >= 5
  const isOptimalPerformance = failedQueriesCount < 1
  const label = isMinorInterruption
    ? "Experiencing minor service interruptions"
    : isCriticalInterruption
    ? "Service is severely impacted due to critical issues"
    : "Service is operating at optimal performance"

  return (
    <Tooltip label={label}>
      <nav
        className={clsxm(
          "flex cursor-pointer justify-center gap-2 md:justify-start",
          className
        )}
      >
        <div
          className={clsxm("mt-1 flex h-2 w-2 items-center rounded-full", {
            "bg-yellow-500": isMinorInterruption,
            "bg-red-500": isCriticalInterruption,
            "bg-green-500": isOptimalPerformance,
          })}
        ></div>
        {showLabels && (
          <span className="flex items-center text-xs text-neutral-400">
            {isMinorInterruption
              ? "Partial Outage"
              : isCriticalInterruption
              ? "Major Outage"
              : "Fully operational"}
          </span>
        )}
      </nav>
    </Tooltip>
  )
}

export default FallbackSignal

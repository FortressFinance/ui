import { FC } from "react"
import { shallow } from "zustand/shallow"

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
  const [failedQueries] = useQueryStatusStore(
    (state) => [state.queryStatus],
    shallow
  )
  const failedQueriesCount = failedQueries.size
  const label =
    failedQueriesCount >= 1 && failedQueriesCount <= 3
      ? "Experiencing minor service interruptions"
      : failedQueriesCount >= 5
      ? "Service is severely impacted due to critical issues"
      : "Service is operating at optimal performance"

  return (
    <Tooltip label={label}>
      <nav
        className={clsxm(
          "flex justify-center gap-2 md:justify-start",
          className
        )}
      >
        <div
          className={`mt-1 flex h-2 w-2 items-center rounded-full ${
            failedQueriesCount >= 1 && failedQueriesCount <= 3
              ? "bg-yellow-500"
              : failedQueriesCount >= 5
              ? "bg-red-500"
              : "bg-green-500"
          }`}
        ></div>
        {showLabels && (
          <span className="flex items-center text-xs text-neutral-400">
            {failedQueriesCount >= 1 && failedQueriesCount <= 3
              ? "Partial Outage"
              : failedQueriesCount >= 5
              ? "Major Outage"
              : "Fully operational"}
          </span>
        )}
      </nav>
    </Tooltip>
  )
}

export default FallbackSignal

import { FC, Fragment } from "react"
import { BiInfoCircle } from "react-icons/bi"

import { formatPercentage } from "@/lib/helpers/formatPercentage"

import Skeleton from "@/components/Skeleton"
import Tooltip from "@/components/Tooltip"
import { GradientText } from "@/components/Typography"

type VaultStrategyModalDefinitionListProps = {
  isLoading?: boolean
  items: Array<{
    label: string
    value?: number
    emphasis?: boolean
  }>
}

export const VaultStrategyModalDefinitionList: FC<
  VaultStrategyModalDefinitionListProps
> = ({ isLoading = false, items }) => {
  const definedItems = items.filter((item) => item.value !== undefined)
  return (
    <Skeleton isLoading={isLoading} className="block w-full">
      {definedItems.length > 0 ? (
        <dl className="grid grid-cols-[max-content,auto] gap-2 text-sm text-pink-50">
          {definedItems.map((item, index) => (
            <Fragment key={`aprItem-${index}`}>
              {item.emphasis ? (
                <>
                  <dt className="flex items-center gap-1 text-base font-bold">
                    <GradientText>{item.label}</GradientText>
                    <Tooltip label="APY calculation assumes weekly compounding and excludes Fortress fees">
                      <span>
                        <BiInfoCircle className="h-5 w-5 cursor-pointer" />
                      </span>
                    </Tooltip>
                  </dt>
                  <dd className="text-right text-base font-bold">
                    <GradientText>{formatPercentage(item.value)}</GradientText>
                  </dd>
                </>
              ) : (
                <>
                  <dt>{item.label}</dt>
                  <dd className="text-right">{formatPercentage(item.value)}</dd>
                </>
              )}
            </Fragment>
          ))}
        </dl>
      ) : (
        <div className="text-center">No data</div>
      )}
    </Skeleton>
  )
}

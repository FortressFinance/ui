import { FC } from "react"

type PercentageProps = {
  children: number | string | undefined
  truncate?: boolean
}

const Percentage: FC<PercentageProps> = ({ children, truncate }) => {
  const asPercentage = Number(children) * 100
  return truncate ? (
    <>{Math.floor(asPercentage)}%</>
  ) : (
    <>{asPercentage.toFixed(2)}%</>
  )
}

export default Percentage

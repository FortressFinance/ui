import { FC } from "react"

import { localeNumber } from "@/lib/helpers"

type PercentageProps = {
  children: number | string | undefined
}

const Percentage: FC<PercentageProps> = ({ children }) => {
  const localizedPercentage = localeNumber(Number(children) * 100, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return <>{localizedPercentage}%</>
}

export default Percentage

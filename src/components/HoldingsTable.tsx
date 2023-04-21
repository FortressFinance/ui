import { FC } from "react"

import { ProductType } from "@/lib/types"

import CompounderHoldingsTable from "@/components/Compounder/CompounderHoldingsTable"
import ConcentratorHoldingsTable from "@/components/Concentrator/ConcentratorHoldingsTable"

const HoldingsTable: FC<{
  productType?: ProductType
}> = ({ productType }) => {
  return (
    <>
      {productType === "compounder" ? (
        <CompounderHoldingsTable showEarningsColumn />
      ) : (
        <ConcentratorHoldingsTable />
      )}
    </>
  )
}

export default HoldingsTable

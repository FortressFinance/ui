import { FC } from "react"

import { ManagedVaultsLeftPanel } from "@/components/Modal/VaultStrategyModal/managedVaults/ManagedVaultsLeftPanel"
import { VaultRowPropsWithProduct } from "@/components/VaultRow"

import strategyText from "@/constant/strategyText"

export const VaultStrategyLeftPanel: FC<VaultRowPropsWithProduct> = ({
  ...vaultProps
}) => {
  const productType = vaultProps.productType
  const strategyTextValue =
    strategyText[productType]?.[
      productType === "compounder" ? vaultProps.asset : vaultProps.vaultAddress
    ]

  return productType !== "managedVaults" ? (
    <>
      {/* Vault description */}
      <div className="max-md:row-start-2">
        <h1 className="border-b border-pink-800 p-3 text-xs font-semibold uppercase text-pink-300 max-md:border-t max-md:text-center md:px-5">
          Vault description
        </h1>

        <div className="space-y-3 p-4 pb-5 leading-relaxed text-pink-50 max-md:text-sm md:px-5">
          {strategyTextValue ?? "No description available"}
        </div>
      </div>
    </>
  ) : (
    <ManagedVaultsLeftPanel />
  )
}

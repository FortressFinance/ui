import { FC } from "react"
import { BiInfoCircle } from "react-icons/bi"

import { formatPercentage } from "@/lib/helpers"
import { useIsTokenVault, useVaultFees } from "@/hooks"

import {
  VaultStrategyModalAmmApr,
  VaultStrategyModalTokenApr,
} from "@/components/Modal"
import Skeleton from "@/components/Skeleton"
import Tooltip from "@/components/Tooltip"
import { VaultRowPropsWithProduct } from "@/components/VaultRow"

export const CompounderRightPanel: FC<VaultRowPropsWithProduct> = ({
  ...vaultProps
}) => {
  const fees = useVaultFees(vaultProps)
  const isToken = useIsTokenVault(vaultProps.type)

  return (
    <>
      {/* APR */}
      <div className="sm:grid sm:grid-cols-2 sm:divide-x sm:divide-pink-800 md:block md:divide-x-0">
        <div>
          <h1 className="border-b border-pink-800 p-3 text-xs font-semibold uppercase text-pink-300 max-md:text-center md:px-5">
            APR{" "}
          </h1>
          <div className="p-4 pb-5 md:px-5">
            {isToken ? (
              <VaultStrategyModalTokenApr {...vaultProps} />
            ) : (
              <VaultStrategyModalAmmApr {...vaultProps} />
            )}
          </div>
        </div>

        {/* Fees */}
        <div>
          <h1 className="border-b border-pink-800 p-3 text-xs font-semibold uppercase text-pink-300 max-md:text-center max-sm:border-t md:border-t md:px-5">
            Fortress fees
          </h1>
          <dl className="grid grid-cols-[max-content,auto] gap-2 p-4 pb-5 text-sm text-pink-50 md:px-5">
            <dt>Deposit</dt>
            <dd className="text-right">
              <Skeleton isLoading={fees.isLoading}>
                {formatPercentage(fees.data?.depositFee)}
              </Skeleton>
            </dd>
            <dt>
              <Tooltip label="Withdrawal fees stay in the vault and are distributed to vault participants. Used as a mechanism to protect against mercenary capital.">
                <span className="flex items-center gap-1">
                  Withdrawal <BiInfoCircle className="h-5 w-5 cursor-pointer" />
                </span>
              </Tooltip>
            </dt>
            <dd className="text-right">
              <Skeleton isLoading={fees.isLoading}>
                {formatPercentage(fees.data?.withdrawFee)}
              </Skeleton>
            </dd>
            <dt>Management</dt>
            <dd className="text-right">
              <Skeleton isLoading={fees.isLoading}>
                {formatPercentage(fees.data?.managementFee)}
              </Skeleton>
            </dd>
            <dt>Performance</dt>
            <dd className="text-right">
              <Skeleton isLoading={fees.isLoading}>
                {formatPercentage(fees.data?.platformFee)}
              </Skeleton>
            </dd>
          </dl>
        </div>
      </div>
    </>
  )
}

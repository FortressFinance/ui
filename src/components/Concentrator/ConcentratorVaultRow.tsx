import { Disclosure } from "@headlessui/react"
import { FC, Fragment, MouseEventHandler, useState } from "react"

import clsxm from "@/lib/clsxm"
import { ConcentratorVaultProps } from "@/lib/types"
import { useVault } from "@/hooks"

import { AssetLogo } from "@/components/Asset"
import { ConcentratorVaultApy } from "@/components/Concentrator/ConcentratorVaultApy"
import { ConcentratorVaultTvl } from "@/components/Concentrator/ConcentratorVaultTvl"
import { ConcentratorVaultUserBalance } from "@/components/Concentrator/ConcentratorVaultUserBalance"
import { TableCell, TableRow } from "@/components/Table"
import { VaultName } from "@/components/VaultRow/lib"

import { FortIconChevronDownCircle } from "@/icons"

export const ConcentratorVaultRow: FC<ConcentratorVaultProps> = (props) => {
  //const [isStrategyOpen, setIsStrategyOpen] = useState(false)
  const [isVaultOpen, setIsVaultOpen] = useState(false)

  // const concentrator = useConcentratorVault({
  //   concentratorTargetAsset: props.targetAsset,
  //   vaultAssetAddress: props.primaryAsset,
  //   vaultType: props.type ?? "balancer",
  // })

  const { isLoading } = useVault({
    asset: props.primaryAsset,
    vaultAddress: props.targetAsset,
  })

  const toggleVaultOpen: MouseEventHandler<
    HTMLButtonElement | HTMLDivElement
  > = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsVaultOpen((v) => !v)
  }

  return (
    <Disclosure as={Fragment} key={props.primaryAsset}>
      <TableRow
        className="lg:grid-cols-[4fr,1fr,1fr,1fr,3.5rem] lg:py-6 lg:first:rounded-t-none"
        onClick={toggleVaultOpen}
        disabled={isLoading}
      >
        {/* Row of vault info */}
        <TableCell className="relative grid grid-cols-[max-content,auto,max-content] items-center gap-x-3 max-lg:-mx-3 max-lg:border-b max-lg:border-b-pink/30 max-lg:px-3 max-lg:pb-3.5 lg:pointer-events-none">
          <AssetLogo
            className="flex h-12 w-12"
            tokenAddress={props.targetAsset}
          />

          <span className="line-clamp-2 max-lg:mr-8">
            <VaultName
              asset={props.primaryAsset}
              vaultAddress={props.targetAsset}
            />
          </span>

          {/* Mobile: expand/collapse button */}
          <button
            className="group absolute inset-0 flex items-center justify-end focus:outline-none lg:hidden"
            disabled={isLoading}
            onClick={toggleVaultOpen}
          >
            <div
              className={clsxm(
                "group mb-3 mr-5 block h-6 w-6 rounded-sm transition-transform duration-200 group-focus-visible:outline-double",
                {
                  "cursor-wait": isLoading,
                  "-rotate-180": isVaultOpen,
                }
              )}
            >
              <FortIconChevronDownCircle
                className="h-full w-full fill-white"
                aria-label="Open vault"
              />
            </div>
          </button>
        </TableCell>

        {/* Desktop: APY, TVL, Balance */}
        <TableCell className="pointer-events-none text-center max-lg:hidden">
          <ConcentratorVaultApy {...props} />
        </TableCell>
        <TableCell className="pointer-events-none text-center max-lg:hidden">
          <ConcentratorVaultTvl {...props} />
        </TableCell>
        <TableCell className="pointer-events-none text-center max-lg:hidden">
          <ConcentratorVaultUserBalance {...props} />
        </TableCell>
      </TableRow>
    </Disclosure>
  )
}

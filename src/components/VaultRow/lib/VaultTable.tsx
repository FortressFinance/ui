import * as Accordion from "@radix-ui/react-accordion"
import { useRouter } from "next/router"
import {
  Children,
  cloneElement,
  FC,
  isValidElement,
  PropsWithChildren,
} from "react"
import { BiInfoCircle } from "react-icons/bi"

import { resolvedRoute } from "@/lib/helpers"
import { ProductType } from "@/lib/types"

import { Table, TableBody, TableHeader, TableRow } from "@/components/Table"
import Tooltip from "@/components/Tooltip"
import { TxSettingsPopover } from "@/components/TxSettingsPopover"
import { VaultTableRowProps } from "@/components/VaultRow/VaultRow"

type VaultTableProps = {
  label: string
  showEarningsColumn?: boolean
  productType?: ProductType
}

export const VaultTable: FC<PropsWithChildren<VaultTableProps>> = ({
  children,
  label,
  showEarningsColumn,
  productType,
}) => {
  const router = useRouter()
  const {
    pathname,
    query: { category, vaultAddress },
  } = router

  const activeVault =
    vaultAddress && typeof vaultAddress === "string" ? vaultAddress : undefined
  const setActiveVault = (vaultAddress?: string) => {
    const link = resolvedRoute(pathname, { category, vaultAddress })
    // Replace the current history entry instead of pushing a new one
    // Expanding/collapse a vault should not create a new history entry
    router.replace(link.href, link.as, { shallow: true })
  }

  return (
    <Table>
      <div className="relative z-[1] max-lg:hidden" role="rowgroup">
        <TableRow
          className="overflow-visible rounded-b-none border-b border-b-pink/30"
          showEarningsColumn={showEarningsColumn}
          productType={productType}
        >
          <TableHeader className="text-sm">
            {productType === "concentrator" ? (
              <Tooltip label="To get into the auto-concentrator vault, make a deposit below. You will be given ERC20 tokens representing vault shares in exchange for your proportionate share of the concentrator money.">
                <span>
                  <div className="float-left mr-1">{label}</div>
                  <BiInfoCircle className="float-left h-5 w-5 cursor-pointer" />
                </span>
              </Tooltip>
            ) : (
              label
            )}
          </TableHeader>
          <TableHeader className="text-center text-sm">APY</TableHeader>
          <TableHeader className="text-center text-sm">TVL</TableHeader>
          <TableHeader className="text-center text-sm">Balance</TableHeader>
          {showEarningsColumn && (
            <TableHeader className="text-center text-sm">Earnings</TableHeader>
          )}
          {productType === "managedVaults" && (
            <>
              <TableHeader className="text-center text-sm">Epoch</TableHeader>
              <TableHeader className="text-center text-sm">Manager</TableHeader>
            </>
          )}
          <TableHeader className="flex justify-end">
            <TxSettingsPopover />
          </TableHeader>
        </TableRow>
      </div>

      <Accordion.Root
        asChild
        value={activeVault}
        onValueChange={setActiveVault}
        type="single"
        collapsible
      >
        <TableBody>
          {Children.map(children, (c) => {
            if (isValidElement<VaultTableRowProps>(c)) {
              return cloneElement<VaultTableRowProps>(c, {
                activeVault,
                setActiveVault,
              })
            }
          })}
        </TableBody>
      </Accordion.Root>
    </Table>
  )
}

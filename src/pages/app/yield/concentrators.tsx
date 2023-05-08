import * as Tabs from "@radix-ui/react-tabs"
import { NextPage } from "next"
import { useRouter } from "next/router"
import { FC, useEffect, useState } from "react"
import { Address } from "wagmi"

import { capitalizeFirstLetter, resolvedRoute } from "@/lib/helpers"
import { FilterCategory, ProductType, VaultType } from "@/lib/types"
import { useActiveChainId } from "@/hooks"

import { DisabledPage } from "@/components"
import {
  ConcentratorMenu,
  ConcentratorRewards,
  ConcentratorVaultTable,
} from "@/components/Concentrator"
import ConcentratorHoldingsTable from "@/components/Concentrator/ConcentratorHoldingsTable"
import Layout from "@/components/Layout"
import { VaultStrategyModal } from "@/components/Modal"
import Seo from "@/components/Seo"
import { TabButton, TabContent, TabListGroup } from "@/components/Tabs"

import { DISABLE_CONCENTRATORS } from "@/constant/env"

const Concentrators: NextPage = () => {
  const router = useRouter()
  const {
    pathname,
    query: { asset, category, type, vaultAddress, productType, ybTokenAddress },
  } = router

  return (
    <DisabledPage isDisabled={DISABLE_CONCENTRATORS}>
      <Layout>
        <Seo
          templateTitle="Concentrators"
          description="Concentrators automatically re-invest earnings into specific target assets"
        />
        <main>
          {/* Child component because we need queryClient to retrieve vaults */}
          <ConcentratorVaults />
        </main>
        <VaultStrategyModal
          isOpen={!!router.query.asset}
          onClose={() => {
            const link = resolvedRoute(pathname, { category, vaultAddress })
            router.push(link.href, link.as, { shallow: true, scroll: false })
          }}
          asset={asset as Address}
          type={type as VaultType}
          vaultAddress={vaultAddress as Address}
          ybTokenAddress={ybTokenAddress as Address}
          productType={productType as ProductType}
        />
      </Layout>
    </DisabledPage>
  )
}

export default Concentrators

const filterCategories: FilterCategory[] = [
  "featured",
  "crypto",
  "stable",
  "curve",
  "balancer",
]

const ConcentratorVaults: FC = () => {
  const chainId = useActiveChainId()
  const [concentratorTargetAsset, setConcentratorTargetAsset] =
    useState<Address>("0x")

  const [activeFilterCategory, setActiveFilterCategory] =
    useState<FilterCategory>("featured")

  useEffect(() => {
    setConcentratorTargetAsset("0x")
  }, [chainId, setConcentratorTargetAsset])

  return (
    <Tabs.Root
      defaultValue={activeFilterCategory as string}
      onValueChange={(filterCategory) =>
        setActiveFilterCategory(filterCategory as FilterCategory)
      }
    >
      <div className="grid grid-cols-[auto,auto] grid-rows-[auto,auto,auto,auto] items-start gap-4 lg:grid-cols-[min-content,auto,min-content] lg:grid-rows-[min-content,1fr] xl:gap-6">
        <Tabs.List className="col-span-2 grid grid-cols-[auto,1fr] gap-y-4 max-lg:row-start-2 lg:gap-6">
          <h1 className="font-display text-4xl max-lg:row-start-2 lg:col-span-full">
            Concentrators
          </h1>

          <TabListGroup className="h-12 max-lg:col-span-full max-lg:col-start-1 max-lg:row-start-3">
            {filterCategories.map((filterCategory, index) => (
              <Tabs.Trigger key={`tab-${index}`} value={filterCategory} asChild>
                <TabButton>{capitalizeFirstLetter(filterCategory)}</TabButton>
              </Tabs.Trigger>
            ))}
          </TabListGroup>

          <div className="row-start-2 flex items-center max-lg:col-span-2 max-lg:col-start-2 max-lg:justify-end lg:col-start-2">
            <TabListGroup className="inline-block">
              <Tabs.Trigger value="holdings" asChild>
                <TabButton>Holdings</TabButton>
              </Tabs.Trigger>
            </TabListGroup>
          </div>
        </Tabs.List>

        <div className="max-lg:col-span-full max-lg:col-start-1 max-md:row-start-1 lg:col-start-3 lg:row-span-full lg:mt-16 lg:self-start">
          <div className="space-y-4 lg:w-72 xl:space-y-6">
            <ConcentratorMenu
              concentratorTargetAsset={concentratorTargetAsset}
              setConcentratorTargetAsset={setConcentratorTargetAsset}
            />
            <ConcentratorRewards
              concentratorTargetAsset={concentratorTargetAsset}
            />
          </div>
        </div>

        <div className="relative col-span-full lg:col-span-2">
          {filterCategories.map((filterCategory, index) => (
            <Tabs.Content
              key={`tab-content-${index}`}
              value={filterCategory}
              asChild
            >
              <TabContent>
                <ConcentratorVaultTable
                  concentratorTargetAsset={concentratorTargetAsset}
                  filterCategory={filterCategory}
                />
              </TabContent>
            </Tabs.Content>
          ))}
          <Tabs.Content value="holdings" asChild>
            <TabContent>
              <ConcentratorHoldingsTable />
            </TabContent>
          </Tabs.Content>
        </div>
      </div>
    </Tabs.Root>
  )
}

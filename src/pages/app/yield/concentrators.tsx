import * as Tabs from "@radix-ui/react-tabs"
import { NextPage } from "next"
import { FC, useState } from "react"
import { Address } from "wagmi"

import { capitalizeFirstLetter } from "@/lib/helpers"
import { FilterCategory } from "@/lib/types"

import {
  ConcentratorMenu,
  ConcentratorRewards,
  ConcentratorVaultTable,
} from "@/components/Concentrator"
import HoldingsTable from "@/components/HoldingsTable"
import Layout from "@/components/Layout"
import Seo from "@/components/Seo"
import { TabButton, TabContent, TabListGroup } from "@/components/Tabs"

const Concentrators: NextPage = () => {
  return (
    <Layout>
      <Seo
        templateTitle="Concentrators"
        description="Concentrators automatically re-invest earnings into specific target assets"
      />

      <main>
        {/* Child component because we need queryClient to retrieve vaults */}
        <ConcentratorVaults />
      </main>
    </Layout>
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
  const [concentratorTargetAsset, setConcentratorTargetAsset] =
    useState<Address>("0x")

  const [activeFilterCategory, setActiveFilterCategory] =
    useState<FilterCategory>("featured")

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
              filterCategory={activeFilterCategory}
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
              <HoldingsTable />
            </TabContent>
          </Tabs.Content>
        </div>
      </div>
    </Tabs.Root>
  )
}

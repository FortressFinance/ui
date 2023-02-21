import { Tab } from "@headlessui/react"
import { NextPage } from "next"
import { FC, useState } from "react"

import { capitalizeFirstLetter } from "@/lib/helpers"
import { FilterCategory, TargetAsset } from "@/lib/types"

import {
  ConcentratorMenu,
  ConcentratorRewards,
  ConcentratorVaultTable,
} from "@/components/Concentrator"
import HoldingsTable from "@/components/Holdings/HoldingsTable"
import Layout from "@/components/Layout"
import { PageHeading } from "@/components/PageHeading"
import Seo from "@/components/Seo"
import { TabButton, TabList, TabListGroup, TabPanels } from "@/components/Tabs"

const Concentrators: NextPage = () => {
  return (
    <Layout>
      <Seo templateTitle="Concentrators" />

      <main>
        <PageHeading>Concentrators</PageHeading>

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
  "curve",
  "balancer",
  "stable",
]

const ConcentratorVaults: FC = () => {
  const [concentratorTargetAsset, setConcentratorTargetAsset] =
    useState<TargetAsset>("auraBAL")
  const [filterIndex, setFilterIndex] = useState(0)

  return (
    <div className="grid grid-cols-1 max-lg:gap-y-4 lg:grid-cols-12 lg:gap-x-4">
      <Tab.Group
        // Not a huge fan of this but it is what it is
        // Maybe can be removed with better registry functions
        onChange={(index) => setFilterIndex(index)}
      >
        <div className="max-lg:row-start-2 lg:col-span-8 xl:col-span-9">
          <Tab.List as={TabList}>
            <TabListGroup className="max-md:max-w-[70%]">
              {filterCategories.map((filterCategory, index) => (
                <Tab
                  as={TabButton}
                  key={`tab-${index}`}
                  className="max-md:max-w-[33%] max-md:basis-0"
                >
                  {capitalizeFirstLetter(filterCategory)}
                </Tab>
              ))}
            </TabListGroup>

            <TabListGroup className="max-md:max-h-[38px]">
              <Tab as={TabButton} className="basis-0">
                Holdings
              </Tab>
            </TabListGroup>
          </Tab.List>

          <Tab.Panels as={TabPanels}>
            {filterCategories.map((filterCategory, index) => (
              <Tab.Panel key={`tab-panel-${index}`}>
                <ConcentratorVaultTable
                  concentratorTargetAsset={concentratorTargetAsset}
                  filterCategory={filterCategory}
                />
              </Tab.Panel>
            ))}

            <Tab.Panel>
              <HoldingsTable />
            </Tab.Panel>
          </Tab.Panels>
        </div>
      </Tab.Group>

      <div className="space-y-4 max-lg:row-start-1 lg:col-span-4 xl:col-span-3">
        <ConcentratorMenu
          concentratorTargetAsset={concentratorTargetAsset}
          setConcentratorTargetAsset={setConcentratorTargetAsset}
        />
        <ConcentratorRewards
          concentratorTargetAsset={concentratorTargetAsset}
          filterCategory={filterCategories[filterIndex]}
        />
      </div>
    </div>
  )
}

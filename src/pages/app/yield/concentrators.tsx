import { Tab } from "@headlessui/react"
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
import { TabButton, TabListGroup, TabPanels } from "@/components/Tabs"

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
  const [filterIndex, setFilterIndex] = useState(0)

  return (
    <Tab.Group
      // Not a huge fan of this but it is what it is
      // Maybe can be removed with better registry functions
      onChange={(index) => setFilterIndex(index)}
    >
      <div className="grid grid-cols-[auto,auto,auto] grid-rows-[auto,auto,auto,auto] items-start gap-4 lg:grid-cols-[min-content,auto,min-content] lg:grid-rows-[min-content,min-content,1fr] xl:gap-6">
        <h1 className="font-display text-4xl max-lg:row-start-2 lg:col-span-full lg:row-start-1">
          Concentrators
        </h1>

        <TabListGroup className="h-12 max-lg:col-span-full max-lg:col-start-1 max-lg:row-start-3 lg:row-start-2">
          {filterCategories.map((filterCategory, index) => (
            <Tab as={TabButton} key={`tab-${index}`}>
              {capitalizeFirstLetter(filterCategory)}
            </Tab>
          ))}
        </TabListGroup>

        <div className="row-start-2 flex items-center max-lg:col-span-2 max-lg:col-start-2 max-lg:justify-end lg:col-start-2">
          <TabListGroup className="inline-block">
            <Tab as={TabButton}>Holdings</Tab>
          </TabListGroup>
        </div>

        <div className="max-lg:col-span-full max-lg:col-start-1 max-md:row-start-1 lg:col-start-3 lg:row-span-full lg:row-start-2 lg:self-start">
          <div className="space-y-4 lg:w-72 xl:space-y-6">
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

        <div className="col-span-full lg:col-span-2 lg:row-start-3">
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
              <HoldingsTable showEarningsColumn={false} />
            </Tab.Panel>
          </Tab.Panels>
        </div>
      </div>
    </Tab.Group>
  )
}

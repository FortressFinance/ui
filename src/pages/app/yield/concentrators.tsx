import { Tab } from "@headlessui/react"
import { NextPage } from "next"
import { FC, useState } from "react"

import { ConcentratorTargetAsset } from "@/lib/types"

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

const ConcentratorVaults: FC = () => {
  const [concentratorTargetAsset, setConcentratorTargetAsset] =
    useState<ConcentratorTargetAsset>("auraBAL")

  return (
    <div className="grid grid-cols-1 max-lg:gap-y-6 lg:grid-cols-4 lg:gap-x-4">
      <Tab.Group as="div" className="max-lg:row-start-2 lg:col-span-3">
        <Tab.List as={TabList}>
          <TabListGroup className="max-md:max-w-[70%]">
            <Tab as={TabButton} className="max-md:max-w-[33%] max-md:basis-0">
              Featured
            </Tab>
            <Tab as={TabButton} className="max-md:max-w-[33%] max-md:basis-0">
              Crypto
            </Tab>
            <Tab as={TabButton} className="max-md:max-w-[33%] max-md:basis-0">
              Stable
            </Tab>
            <Tab as={TabButton} className="max-md:max-w-[33%] max-md:basis-0">
              Curve
            </Tab>
            <Tab as={TabButton} className="max-md:max-w-[33%] max-md:basis-0">
              Balancer
            </Tab>
          </TabListGroup>
          <TabListGroup className="max-md:max-h-[38px]">
            <Tab as={TabButton} className="basis-0">
              Holdings
            </Tab>
          </TabListGroup>
        </Tab.List>

        <Tab.Panels as={TabPanels}>
          <Tab.Panel>
            <ConcentratorVaultTable
              concentratorTargetAsset={concentratorTargetAsset}
              filter="featured"
              vaultType="token"
            />
          </Tab.Panel>
          <Tab.Panel>
            <ConcentratorVaultTable
              concentratorTargetAsset={concentratorTargetAsset}
              filter="crypto"
              vaultType="token"
            />
          </Tab.Panel>
          <Tab.Panel>
            <ConcentratorVaultTable
              concentratorTargetAsset={concentratorTargetAsset}
              filter="stable"
              vaultType="token"
            />
          </Tab.Panel>
          <Tab.Panel>
            <ConcentratorVaultTable
              concentratorTargetAsset={concentratorTargetAsset}
              filter="curve"
              vaultType="curve"
            />
          </Tab.Panel>
          <Tab.Panel>
            <ConcentratorVaultTable
              concentratorTargetAsset={concentratorTargetAsset}
              filter="balancer"
              vaultType="balancer"
            />
          </Tab.Panel>
          <Tab.Panel>
            <HoldingsTable />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>

      <div className="space-y-4 max-lg:row-start-1">
        <ConcentratorMenu
          concentratorTargetAsset={concentratorTargetAsset}
          setConcentratorTargetAsset={setConcentratorTargetAsset}
        />
        <ConcentratorRewards />
      </div>
    </div>
  )
}

import { Tab } from "@headlessui/react"
import { NextPage } from "next"
import { useRouter } from "next/router"
import { Address } from "wagmi"

import { appLink } from "@/lib/helpers"
import { VaultType } from "@/lib/types"

import { CompounderVaultTable } from "@/components/Compounder"
import HoldingsTable from "@/components/HoldingsTable"
import Layout from "@/components/Layout"
import { VaultStrategyModal } from "@/components/Modal"
import Seo from "@/components/Seo"
import { TabButton, TabListGroup, TabPanels } from "@/components/Tabs"

const Yield: NextPage = () => {
  const router = useRouter()
  const { asset, type, vaultAddress } = router.query

  return (
    <Layout>
      <Seo
        templateTitle="Compounders"
        description="Compounders automatically re-invest earnings back into their own strategy"
      />

      <main>
        <Tab.Group>
          <Tab.List as="div" className="mb-4 lg:mb-6">
            <div className="grid grid-rows-[auto,auto] items-center gap-4 md:grid-cols-[min-content,auto] xl:gap-6">
              <h1 className="font-display text-4xl md:col-span-full">
                Compounders
              </h1>

              <TabListGroup className="max-md:col-span-2 max-md:col-start-1 max-md:row-start-2">
                <Tab as={TabButton}>Featured</Tab>
                <Tab as={TabButton}>Crypto</Tab>
                <Tab as={TabButton}>Stable</Tab>
                <Tab as={TabButton}>Curve</Tab>
                <Tab as={TabButton}>Balancer</Tab>
              </TabListGroup>

              <div className="flex items-center max-md:col-start-2 max-md:row-start-1 max-md:justify-end">
                <TabListGroup className="inline-block">
                  <Tab as={TabButton}>Holdings</Tab>
                </TabListGroup>
              </div>
            </div>
          </Tab.List>
          <Tab.Panels as={TabPanels}>
            <Tab.Panel>
              <CompounderVaultTable filterCategory="featured" />
            </Tab.Panel>
            <Tab.Panel>
              <CompounderVaultTable filterCategory="crypto" />
            </Tab.Panel>
            <Tab.Panel>
              <CompounderVaultTable filterCategory="stable" />
            </Tab.Panel>
            <Tab.Panel>
              <CompounderVaultTable vaultType="curve" />
            </Tab.Panel>
            <Tab.Panel>
              <CompounderVaultTable vaultType="balancer" />
            </Tab.Panel>
            <Tab.Panel>
              <HoldingsTable earningEnabled />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </main>

      <VaultStrategyModal
        isOpen={!!router.query.asset}
        onClose={() => router.push(appLink("/yield"))}
        asset={asset as Address}
        type={type as VaultType}
        vaultAddress={vaultAddress as Address}
      />
    </Layout>
  )
}

export default Yield

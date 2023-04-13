import * as Tabs from "@radix-ui/react-tabs"
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
import { TabButton, TabListGroup } from "@/components/Tabs"

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
        <Tabs.Root defaultValue="featured">
          <Tabs.List className="mb-4 lg:mb-6">
            <div className="grid grid-rows-[auto,auto] items-center gap-4 md:grid-cols-[min-content,auto] xl:gap-6">
              <h1 className="font-display text-4xl md:col-span-full">
                Compounders
              </h1>

              <TabListGroup className="max-md:col-span-2 max-md:col-start-1 max-md:row-start-2">
                <Tabs.Trigger value="featured" asChild>
                  <TabButton>Featured</TabButton>
                </Tabs.Trigger>
                <Tabs.Trigger value="crypto" asChild>
                  <TabButton>Crypto</TabButton>
                </Tabs.Trigger>
                <Tabs.Trigger value="stable" asChild>
                  <TabButton>Stable</TabButton>
                </Tabs.Trigger>
                <Tabs.Trigger value="curve" asChild>
                  <TabButton>Curve</TabButton>
                </Tabs.Trigger>
                <Tabs.Trigger value="balancer" asChild>
                  <TabButton>Balancer</TabButton>
                </Tabs.Trigger>
              </TabListGroup>

              <div className="flex items-center max-md:col-start-2 max-md:row-start-1 max-md:justify-end">
                <TabListGroup className="inline-block">
                  <Tabs.Trigger value="holdings" asChild>
                    <TabButton>Holdings</TabButton>
                  </Tabs.Trigger>
                </TabListGroup>
              </div>
            </div>
          </Tabs.List>

          <Tabs.Content value="featured">
            <CompounderVaultTable filterCategory="featured" />
          </Tabs.Content>
          <Tabs.Content value="crypto">
            <CompounderVaultTable filterCategory="crypto" />
          </Tabs.Content>
          <Tabs.Content value="stable">
            <CompounderVaultTable filterCategory="stable" />
          </Tabs.Content>
          <Tabs.Content value="curve">
            <CompounderVaultTable vaultType="curve" />
          </Tabs.Content>
          <Tabs.Content value="balancer">
            <CompounderVaultTable vaultType="balancer" />
          </Tabs.Content>
          <Tabs.Content value="holdings">
            <HoldingsTable showEarningsColumn />
          </Tabs.Content>
        </Tabs.Root>
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

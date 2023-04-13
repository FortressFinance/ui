import * as Tabs from "@radix-ui/react-tabs"
import { NextPage } from "next"
import { useRouter } from "next/router"
import { Address } from "wagmi"

import { resolvedRoute } from "@/lib/helpers"
import { VaultType } from "@/lib/types"

import { CompounderVaultTable } from "@/components/Compounder"
import HoldingsTable from "@/components/HoldingsTable"
import Layout from "@/components/Layout"
import { VaultStrategyModal } from "@/components/Modal"
import Seo from "@/components/Seo"
import { TabButton, TabContent, TabListGroup } from "@/components/Tabs"

const Yield: NextPage = () => {
  const router = useRouter()
  const {
    pathname,
    query: { asset, category, type, vaultAddress },
  } = router

  return (
    <Layout>
      <Seo
        templateTitle="Compounders"
        description="Compounders automatically re-invest earnings back into their own strategy"
      />

      <main>
        <Tabs.Root
          value={
            category && typeof category === "string" ? category : "featured"
          }
          onValueChange={(category) => {
            const link = resolvedRoute(pathname, { category })
            router.push(link.href, link.as, { shallow: true })
          }}
        >
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

          <div className="relative">
            <Tabs.Content value="featured" asChild>
              <TabContent>
                <CompounderVaultTable filterCategory="featured" />
              </TabContent>
            </Tabs.Content>
            <Tabs.Content value="crypto" asChild>
              <TabContent>
                <CompounderVaultTable filterCategory="crypto" />
              </TabContent>
            </Tabs.Content>
            <Tabs.Content value="stable" asChild>
              <TabContent>
                <CompounderVaultTable filterCategory="stable" />
              </TabContent>
            </Tabs.Content>
            <Tabs.Content value="curve" asChild>
              <TabContent>
                <CompounderVaultTable vaultType="curve" />
              </TabContent>
            </Tabs.Content>
            <Tabs.Content value="balancer" asChild>
              <TabContent>
                <CompounderVaultTable vaultType="balancer" />
              </TabContent>
            </Tabs.Content>
            <Tabs.Content value="holdings" asChild>
              <TabContent>
                <HoldingsTable showEarningsColumn />
              </TabContent>
            </Tabs.Content>
          </div>
        </Tabs.Root>
      </main>

      <VaultStrategyModal
        isOpen={!!router.query.asset}
        onClose={() => {
          const link = resolvedRoute(pathname, { category, vaultAddress })
          router.push(link.href, link.as, { shallow: true })
        }}
        asset={asset as Address}
        type={type as VaultType}
        vaultAddress={vaultAddress as Address}
      />
    </Layout>
  )
}

export default Yield

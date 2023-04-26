import * as Tabs from "@radix-ui/react-tabs"
import { NextPage } from "next"
import { useRouter } from "next/router"

import { resolvedRoute } from "@/lib/helpers"

import Layout from "@/components/Layout"
import { ManagedVaultsTable } from "@/components/ManagedVaults/ManagedVaultsTable"
import Seo from "@/components/Seo"
import { TabButton, TabContent, TabListGroup } from "@/components/Tabs"

const ManagedVaults: NextPage = () => {
  const router = useRouter()
  const {
    pathname,
    query: { category },
  } = router

  return (
    <Layout>
      <Seo
        templateTitle="Managed Vaults"
        description="The Managed Vaults architecture provides permissionless primitives for flexible investment strategy management on-chain."
      />

      <main>
        <Tabs.Root
          value={
            category && typeof category === "string" ? category : "featured"
          }
          onValueChange={(category) => {
            const link = resolvedRoute(pathname, { category })
            router.push(link.href, link.as, { shallow: true, scroll: false })
          }}
        >
          <Tabs.List className="mb-4 lg:mb-6">
            <div className="grid grid-rows-[auto,auto] items-center gap-4 md:grid-cols-[min-content,auto] xl:gap-6">
              <h1 className="font-display text-4xl md:col-span-full">
                Managed Vaults
              </h1>

              <TabListGroup className="max-md:col-span-2 max-md:col-start-1 max-md:row-start-2">
                <Tabs.Trigger value="featured" asChild>
                  <TabButton>Featured</TabButton>
                </Tabs.Trigger>
                <Tabs.Trigger value="immutable" asChild>
                  <TabButton>Immutable</TabButton>
                </Tabs.Trigger>
                <Tabs.Trigger value="all" asChild>
                  <TabButton>All</TabButton>
                </Tabs.Trigger>
              </TabListGroup>
            </div>
          </Tabs.List>

          <div className="relative">
            <Tabs.Content value="featured" asChild>
              <TabContent>
                <ManagedVaultsTable filterCategory="featured" />
              </TabContent>
            </Tabs.Content>
            <Tabs.Content value="immutable" asChild>
              <TabContent>
                <ManagedVaultsTable filterCategory="immutable" />
              </TabContent>
            </Tabs.Content>
            <Tabs.Content value="all" asChild>
              <TabContent>
                <ManagedVaultsTable filterCategory="all" />
              </TabContent>
            </Tabs.Content>
          </div>
        </Tabs.Root>
      </main>
    </Layout>
  )
}

export default ManagedVaults

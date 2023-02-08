import { Tab } from "@headlessui/react"
import { NextPage } from "next"
import { Fragment, useState } from "react"

import clsxm from "@/lib/clsxm"

import HoldingsTable from "@/components/Holdings/HoldingsTable"
import Layout from "@/components/Layout"
import Seo from "@/components/Seo"
import VaultTable from "@/components/Vault"

const Yield: NextPage = () => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const pageTitle = selectedIndex == 5? "Holdings" : "Compounders"

  return (
    <Layout>
      <Seo templateTitle="Yield" />

      <div className="grid gap-6">
        <main>
          <h1 className="mb-6 font-display text-4xl">{pageTitle}</h1>

          <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
            <Tab.List className="flex gap-4">
              <div className="overflow-hidden rounded-md border-2 border-pink/30 bg-black/60">
                <Tab as={Fragment}>
                  {({ selected }) => (
                    <button
                      className={clsxm("py-3 px-6", {
                        "bg-white text-black": selected,
                      })}
                    >
                      Featured
                    </button>
                  )}
                </Tab>
                <Tab as={Fragment}>
                  {({ selected }) => (
                    <button
                      className={clsxm("py-3 px-6", {
                        "bg-white text-black": selected,
                      })}
                    >
                      Crypto
                    </button>
                  )}
                </Tab>
                <Tab as={Fragment}>
                  {({ selected }) => (
                    <button
                      className={clsxm("py-3 px-6", {
                        "bg-white text-black": selected,
                      })}
                    >
                      Stable
                    </button>
                  )}
                </Tab>
                <Tab as={Fragment}>
                  {({ selected }) => (
                    <button
                      className={clsxm("py-3 px-6", {
                        "bg-white text-black": selected,
                      })}
                    >
                      Curve
                    </button>
                  )}
                </Tab>
                <Tab as={Fragment}>
                  {({ selected }) => (
                    <button
                      className={clsxm("py-3 px-6", {
                        "bg-white text-black": selected,
                      })}
                    >
                      Balancer
                    </button>
                  )}
                </Tab>
              </div>
              <div className="overflow-hidden rounded-md border-2 border-pink/30 bg-black/60">
                <Tab as={Fragment}>
                  {({ selected }) => (
                    <button
                      className={clsxm("py-3 px-6", {
                        "bg-white text-black": selected,
                      })}
                    >
                      Holdings
                    </button>
                  )}
                </Tab>
              </div>
            </Tab.List>

            <Tab.Panels className="mt-6">
              <Tab.Panel>
                <VaultTable type="featured" />
              </Tab.Panel>
              <Tab.Panel>
                <VaultTable type="crypto" />
              </Tab.Panel>
              <Tab.Panel>
                <VaultTable type="stable" />
              </Tab.Panel>
              <Tab.Panel>
                <VaultTable type="curve" />
              </Tab.Panel>
              <Tab.Panel>
                <VaultTable type="balancer" />
              </Tab.Panel>
              <Tab.Panel>
                <HoldingsTable />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </main>
      </div>
    </Layout>
  )
}

export default Yield

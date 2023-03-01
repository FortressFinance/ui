import { Tab } from "@headlessui/react"
import { NextPage } from "next"
import { FC } from "react"
import { Address } from "wagmi"

import { capitalizeFirstLetter } from "@/lib/helpers"
import { FilterCategory, VaultProps } from "@/lib/types"
import {
  useCompounderVault,
  useListCompounders,
} from "@/hooks/data/compounders"
import useActiveChainId from "@/hooks/useActiveChainId"
import { useClientReady } from "@/hooks/util"

import { enabledNetworks } from "@/components/AppProviders"
import HoldingsTable from "@/components/Holdings/HoldingsTable"
import Layout from "@/components/Layout"
import Seo from "@/components/Seo"
import { TableEmpty, TableLoading } from "@/components/Table"
import { TabButton, TabListGroup, TabPanels } from "@/components/Tabs"
import VaultRow from "@/components/Vault/VaultRow"
import { VaultTable } from "@/components/Vault/VaultTable"

const Yield: NextPage = () => {
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
              <YieldVaultTable filter="featured" type="token" />
            </Tab.Panel>
            <Tab.Panel>
              <YieldVaultTable filter="crypto" type="token" />
            </Tab.Panel>
            <Tab.Panel>
              <YieldVaultTable filter="stable" type="token" />
            </Tab.Panel>
            <Tab.Panel>
              <YieldVaultTable type="curve" />
            </Tab.Panel>
            <Tab.Panel>
              <YieldVaultTable type="balancer" />
            </Tab.Panel>
            <Tab.Panel>
              <HoldingsTable />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </main>
    </Layout>
  )
}

export default Yield

// HARDCODE HERE AT THE MOMENT, THE BE SHOULD CLASSIFY THEM
const addressesByFilter: Record<FilterCategory, Address[]> = {
  featured: [
    "0x616e8BfA43F920657B3497DBf40D6b1A02D4608d",
    "0x5402B5F40310bDED796c7D0F3FF6683f5C0cFfdf",
  ],
  crypto: [
    "0x616e8BfA43F920657B3497DBf40D6b1A02D4608d",
    "0x5402B5F40310bDED796c7D0F3FF6683f5C0cFfdf",
  ],
  stable: ["0x62B9c7356A2Dc64a1969e19C23e4f579F9810Aa7"],
  curve: [],
  balancer: [],
}

type YieldVaultTableProps = Pick<VaultProps, "type"> & {
  filter?: FilterCategory
}

const YieldVaultTable: FC<YieldVaultTableProps> = ({ filter, type }) => {
  // handle hydration mismatch
  const ready = useClientReady()

  const chainId = useActiveChainId()
  const availableChains = enabledNetworks.chains.filter((n) => n.id === chainId)
  const supportedChain = availableChains?.[0]
  const network = supportedChain?.name

  const { data: compoundersList, isLoading } = useListCompounders({ type })
  const showLoadingState = isLoading || !ready

  const filteredCompounders = filter
    ? compoundersList?.filter((a) => addressesByFilter[filter].includes(a))
    : compoundersList

  return (
    <VaultTable label={`${capitalizeFirstLetter(type)} Compounders`}>
      {showLoadingState ? (
        <TableLoading>Loading compounders...</TableLoading>
      ) : !supportedChain ? (
        <TableEmpty heading="Unsupported network">
          Please switch to a supported network to view Compounders.
        </TableEmpty>
      ) : !filteredCompounders?.length ? (
        <TableEmpty heading="Where Compounders ser?">
          It seems we don't have {capitalizeFirstLetter(type)} Compounders on{" "}
          {network} (yet). Feel free to check out other compounders on {network}{" "}
          or change network. New Compounders and strategies are added often, so
          check back later. Don't be a stranger.
        </TableEmpty>
      ) : (
        filteredCompounders?.map((address, i) => (
          <YieldVaultRow key={`pool-${i}`} asset={address} type={type} />
        ))
      )}
    </VaultTable>
  )
}

type YieldVaultRowProps = Pick<VaultProps, "asset" | "type">

const YieldVaultRow: FC<YieldVaultRowProps> = (props) => {
  const vaultAddress = useCompounderVault(props)
  return <VaultRow {...props} vaultAddress={vaultAddress.data} />
}

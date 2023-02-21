import { Tab } from "@headlessui/react"
import { NextPage } from "next"
import { FC } from "react"
import { Address } from "wagmi"

import { capitalizeFirstLetter } from "@/lib/helpers"
import { FilterCategory, VaultProps } from "@/lib/types"
import { useVaultAddresses } from "@/hooks/data"
import useActiveChainId from "@/hooks/useActiveChainId"
import { useClientReady } from "@/hooks/util/useClientReady"

import { enabledNetworks } from "@/components/AppProviders"
import HoldingsTable from "@/components/Holdings/HoldingsTable"
import Layout from "@/components/Layout"
import { PageHeading } from "@/components/PageHeading"
import Seo from "@/components/Seo"
import { TableEmpty, TableLoading } from "@/components/Table"
import { TabButton, TabList, TabListGroup, TabPanels } from "@/components/Tabs"
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
        <PageHeading>Compounders</PageHeading>

        <Tab.Group>
          <Tab.List as={TabList}>
            <TabListGroup className="max-w-[70%]">
              <Tab as={TabButton} className="max-w-[33%] basis-0">
                Featured
              </Tab>
              <Tab as={TabButton} className="max-w-[33%] basis-0">
                Crypto
              </Tab>
              <Tab as={TabButton} className="max-w-[33%] basis-0">
                Stable
              </Tab>
              <Tab as={TabButton} className="max-w-[33%] basis-0">
                Curve
              </Tab>
              <Tab as={TabButton} className="max-w-[33%] basis-0">
                Balancer
              </Tab>
            </TabListGroup>
            <TabListGroup className="max-h-[38px] md:max-h-[56px]">
              <Tab as={TabButton} className="basis-0">
                Holdings
              </Tab>
            </TabListGroup>
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

  const { data: vaultAddresses, isLoading } = useVaultAddresses({ type })
  const showLoadingState = isLoading || !ready

  const filteredVaultAddresses = filter
    ? vaultAddresses?.filter((a) => addressesByFilter[filter].includes(a))
    : vaultAddresses

  return (
    <VaultTable label={`${capitalizeFirstLetter(type)} Compounders`}>
      {showLoadingState ? (
        <TableLoading>Loading compounders...</TableLoading>
      ) : !supportedChain ? (
        <TableEmpty heading="Unsupported network">
          Please switch to a supported network to view Compounders.
        </TableEmpty>
      ) : !filteredVaultAddresses?.length ? (
        <TableEmpty heading="Where Compounders ser?">
          It seems we don't have {capitalizeFirstLetter(type)} Compounders on{" "}
          {network} (yet). Feel free to check out other compounders on {network}{" "}
          or change network. New Compounders and strategies are added often, so
          check back later. Don't be a stranger.
        </TableEmpty>
      ) : (
        filteredVaultAddresses?.map((address, i) => (
          <VaultRow key={`pool-${i}`} asset={address} type={type} />
        ))
      )}
    </VaultTable>
  )
}

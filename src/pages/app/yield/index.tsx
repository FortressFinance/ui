import { Tab } from "@headlessui/react"
import { NextPage } from "next"
import { FC, useState } from "react"
import { Address } from "wagmi"

import { capitalizeFirstLetter } from "@/lib/helpers"
import { VaultProps } from "@/lib/types"
import { useVaultAddresses } from "@/hooks/data"
import useActiveChainId from "@/hooks/useActiveChainId"
import useClientEffect from "@/hooks/useClientEffect"

import { enabledNetworks } from "@/components/AppProviders"
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
      <Seo templateTitle="Vaults" />

      <main>
        <PageHeading>Vaults</PageHeading>

        <Tab.Group>
          <Tab.List as={TabList}>
            <TabListGroup>
              <Tab as={TabButton}>Featured</Tab>
              <Tab as={TabButton}>Crypto</Tab>
              <Tab as={TabButton}>Stable</Tab>
              <Tab as={TabButton}>Curve</Tab>
              <Tab as={TabButton}>Balancer</Tab>
            </TabListGroup>
            <TabListGroup>
              <Tab as={TabButton}>Holdings</Tab>
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
            <Tab.Panel>Holdings</Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </main>
    </Layout>
  )
}

export default Yield

type FilterCategory = "featured" | "crypto" | "stable"

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
}

type YieldVaultTableProps = Pick<VaultProps, "type"> & {
  filter?: FilterCategory
}

const YieldVaultTable: FC<YieldVaultTableProps> = ({ filter, type }) => {
  // handle hydration mismatch
  const [ready, setReady] = useState(false)
  useClientEffect(() => setReady(true))

  const chainId = useActiveChainId()
  const availableChains = enabledNetworks.chains.filter((n) => n.id === chainId)
  const network = availableChains?.[0].name

  const { data: vaultAddresses, isLoading } = useVaultAddresses({ type })
  const showLoadingState = isLoading || !ready

  const filteredVaultAddresses = filter
    ? vaultAddresses?.filter((a) => addressesByFilter[filter].includes(a))
    : vaultAddresses

  return (
    <VaultTable label={`${capitalizeFirstLetter(type)} Vaults`}>
      {showLoadingState ? (
        <TableLoading>Loading compounders...</TableLoading>
      ) : !filteredVaultAddresses?.length ? (
        <TableEmpty heading="Where Vaults ser?">
          It seems we don't have {capitalizeFirstLetter(type)} Vaults on{" "}
          {network} (yet). Feel free to check out other vaults on {network} or
          change network. New Vaults and strategies are added often, so check
          back later. Don't be a stranger.
        </TableEmpty>
      ) : (
        filteredVaultAddresses?.map((address, i) => (
          <VaultRow key={`pool-${i}`} asset={address} type={type} />
        ))
      )}
    </VaultTable>
  )
}

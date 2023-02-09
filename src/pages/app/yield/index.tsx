import { Tab } from "@headlessui/react"
import { NextPage } from "next"
import { FC, useState } from "react"

import { capitalizeFirstLetter } from "@/lib/helpers"
import { VaultProps } from "@/lib/types"
import { useVaultAddresses } from "@/hooks/data"
import useActiveChainId from "@/hooks/useActiveChainId"
import useClientEffect from "@/hooks/useClientEffect"

import { enabledNetworks } from "@/components/AppProviders"
import Layout from "@/components/Layout"
import { PageHeading } from "@/components/PageHeading"
import Seo from "@/components/Seo"
import {
  Table,
  TableBody,
  TableEmpty,
  TableHeader,
  TableHeaderRow,
  TableLoading,
} from "@/components/Table"
import { TabButton, TabList, TabListGroup, TabPanels } from "@/components/Tabs"
import VaultRow from "@/components/Vault/VaultRow"

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
              <YieldVaultTable type="featured" />
            </Tab.Panel>
            <Tab.Panel>
              <YieldVaultTable type="crypto" />
            </Tab.Panel>
            <Tab.Panel>
              <YieldVaultTable type="stable" />
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

const YieldVaultTable: FC<Pick<VaultProps, "type">> = ({ type }) => {
  // handle hydration mismatch
  const [ready, setReady] = useState(false)
  useClientEffect(() => setReady(true))

  const chainId = useActiveChainId()
  const availableChains = enabledNetworks.chains.filter((n) => n.id === chainId)
  const network = availableChains?.[0].name

  const { data: vaultAddresses, isLoading } = useVaultAddresses({ type })
  const showLoadingState = isLoading || !ready

  return (
    <Table>
      <TableHeaderRow>
        <TableHeader>Vault</TableHeader>
        <TableHeader className="text-center">APR</TableHeader>
        <TableHeader className="text-center">TVL</TableHeader>
        <TableHeader className="text-center">Deposit</TableHeader>
        <TableHeader>
          <span className="sr-only">Vault actions</span>
        </TableHeader>
      </TableHeaderRow>

      <TableBody>
        {showLoadingState ? (
          <TableLoading>Loading compounders...</TableLoading>
        ) : !vaultAddresses?.length ? (
          <TableEmpty heading="Where Vaults ser?">
            It seems we don't have {capitalizeFirstLetter(type)} Vaults on{" "}
            {network} (yet). Feel free to check out other vaults on {network} or
            change network. New Vaults and strategies are added often, so check
            back later. Don't be a stranger.
          </TableEmpty>
        ) : (
          vaultAddresses?.map((address, i) => (
            <VaultRow key={`pool-${i}`} asset={address} type={type} />
          ))
        )}
      </TableBody>
    </Table>
  )
}

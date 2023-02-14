import { Tab } from "@headlessui/react"
import { NextPage } from "next"
import { FC, useState } from "react"

import { ConcentratorType } from "@/lib/types"
import {
  ConcentratorVaultProps,
  useListAssetsForConcentrator,
  useVaultForConcentrator,
} from "@/hooks/data/concentrators"
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

type ConcentratorDefinition = { label: string; type: ConcentratorType }

const concentratorDefinitiosn: ConcentratorDefinition[] = [
  { label: "Balancer AuraBAL", type: "balancerAuraBal" },
  { label: "Balancer ETH", type: "balancerEth" },
  { label: "Curve cvxCRV", type: "curveCvxCrv" },
  { label: "Curve ETH", type: "curveEth" },
]

const ConcentratorVaults: FC = () => {
  return (
    <>
      <Tab.Group>
        <Tab.List as={TabList}>
          <TabListGroup>
            {concentratorDefinitiosn.map(({ label, type }) => (
              <Tab as={TabButton} key={`${type}-button`} className="w-[50%] basis-0">
                {label}
              </Tab>
            ))}
          </TabListGroup>
        </Tab.List>

        <Tab.Panels as={TabPanels}>
          {concentratorDefinitiosn.map(({ label, type }) => (
            <Tab.Panel key={`${type}-panel`}>
              <ConcentratorVaultsTable label={label} type={type} />
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </>
  )
}

const ConcentratorVaultsTable: FC<ConcentratorDefinition> = ({
  label,
  type,
}) => {
  // handle hydration mismatch
  const [ready, setReady] = useState(false)
  useClientEffect(() => setReady(true))

  const chainId = useActiveChainId()
  const availableChains = enabledNetworks.chains.filter((n) => n.id === chainId)
  const network = availableChains?.[0].name

  const { data: vaultAddresses, isLoading } = useListAssetsForConcentrator({
    type,
  })
  const showLoadingState = isLoading || !ready

  return (
    <VaultTable label={`${label} Vaults`}>
      {showLoadingState ? (
        <TableLoading>Loading concentrators...</TableLoading>
      ) : !vaultAddresses?.length ? (
        <TableEmpty heading="Where Concentrators ser?">
          It seems we don't have {label} Concentrators on {network} (yet). Feel
          free to check out other Concentrators on {network} or change network.
          New Concentrators and strategies are added often, so check back later.
          Don't be a stranger.
        </TableEmpty>
      ) : (
        vaultAddresses?.map((address, i) => (
          <ConcentratorVaultRow key={`pool-${i}`} asset={address} type={type} />
        ))
      )}
    </VaultTable>
  )
}

const ConcentratorVaultRow: FC<ConcentratorVaultProps> = (props) => {
  const { data: vaultProps } = useVaultForConcentrator(props)
  return <VaultRow {...vaultProps} />
}

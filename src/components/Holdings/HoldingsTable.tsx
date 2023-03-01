import { Children, FC } from "react"
import { Address } from "wagmi"

import { VaultType } from "@/lib/types"
import { useListCompounders } from "@/hooks/data/compounders"
import { useClientReady } from "@/hooks/util"

import { HoldingsRow } from "@/components/Holdings/HoldingsRow"
import { TableEmpty, TableLoading } from "@/components/Table"
import { VaultTable } from "@/components/Vault/VaultTable"

const HoldingsTable: FC = () => {
  // handle hydration mismatch
  const ready = useClientReady()
  
  const curveVaultType = "curve"
  const balancerVaultType = "balancer"
  const tokenVaultType = "token"
  const { data: curveCompoundersList, isLoading: curveIsLoading } = useListCompounders({ type: curveVaultType })
  const { data: balancerCompoundersList, isLoading: balancerIsLoading } = useListCompounders({ type: balancerVaultType })
  const { data: tokenCompoundersList, isLoading: tokenIsLoading } = useListCompounders({ type: tokenVaultType })

  const compoundersList: { [key: string]: Address[] | readonly Address[] } = {}
  if(curveCompoundersList){
    compoundersList[curveVaultType] = curveCompoundersList
  }
  if(balancerCompoundersList){    
    compoundersList[balancerVaultType] = balancerCompoundersList
  }
  if(tokenCompoundersList){    
    compoundersList[tokenVaultType] = tokenCompoundersList
  }

  const showLoadingState = curveIsLoading || balancerIsLoading || tokenIsLoading || !ready
  const vaultsWithDeposits = Object.entries(compoundersList).map(([key, value]) => (
    value?.map((address, i) => (
      <HoldingsRow key={`pool-${key}-${i}`} asset={address} type={key as VaultType} />
    ))
  ))
  const flat = vaultsWithDeposits.flat()
  flat.map(x => Children.map(x, child => console.log(">>>>>>", Children.toArray(x))))

  return (
    <VaultTable label="Holdings">
      {/* Table body */}
      {showLoadingState ? (
        <TableLoading>Loading holdings...</TableLoading>
      ) : !Object.entries(compoundersList)?.length ? (
        <TableEmpty heading="Well, this is awkward...">
          You don't appear to have any deposits in our Vaults. There's an easy way
          to change that.
        </TableEmpty>
      ) : (
        flat.filter(x => Children.count(x) !== 0).length == 0? <div>test</div> : <div>dfdfs</div>
      )}
    </VaultTable>
  )
}

export default HoldingsTable

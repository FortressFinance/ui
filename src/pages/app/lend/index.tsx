import { NextPage } from "next"

import clsxm from "@/lib/clsxm"
import { useActiveChainId, useClientReady } from "@/hooks"

import { DisabledPage } from "@/components"
import Layout from "@/components/Layout"
import { LendingPairRow } from "@/components/LendingPair"
import Seo from "@/components/Seo"
import { Table, TableEmpty, TableHeader } from "@/components/Table"

import { lendingPairs } from "@/constant"
import { DISABLE_LENDING } from "@/constant/env"

const Lend: NextPage = () => {
  const isClientReady = useClientReady()
  const chainId = useActiveChainId()
  const chainLendingPairs = isClientReady
    ? lendingPairs.filter((n) => n.chainId === chainId)
    : []

  return (
    <DisabledPage isDisabled={DISABLE_LENDING}>
      <Layout>
        <Seo templateTitle="Lend" />

        <main>
          <div className="grid grid-cols-1 gap-4 xl:gap-6">
            <h1 className="font-display text-4xl">Lend</h1>

            <Table>
              <div className="max-lg:hidden" role="rowgroup">
                <div
                  className="relative items-center gap-x-3 overflow-hidden rounded-t-lg border-b border-b-pink/30 bg-pink-900/80 p-3 backdrop-blur-md lg:grid lg:grid-cols-[3.5fr,1fr,1fr,1fr,7rem] lg:px-6"
                  role="row"
                >
                  <TableHeader className="text-sm">Lending pair</TableHeader>
                  <TableHeader className="text-center text-sm">APY</TableHeader>
                  <TableHeader className="text-center text-sm">
                    Utilization
                  </TableHeader>
                  <TableHeader className="text-center text-sm">
                    Shares
                  </TableHeader>
                  <TableHeader />
                </div>
              </div>

              {isClientReady && chainLendingPairs.length ? (
                chainLendingPairs.map((lendingPair, index) => (
                  <div
                    key={lendingPair.pairAddress}
                    className={clsxm(
                      "relative items-center gap-x-3 overflow-hidden bg-pink-900/80 p-3 backdrop-blur-md lg:grid lg:grid-cols-[3.5fr,1fr,1fr,1fr,7rem] lg:p-6",
                      {
                        "rounded-lg": index > 0,
                        "rounded-b-lg": index === 0,
                      }
                    )}
                    role="row"
                  >
                    <LendingPairRow {...lendingPair} />
                  </div>
                ))
              ) : (
                <TableEmpty heading="Well, this is awkward...">
                  It seems we don't have any lending pairs available on this
                  network (yet). New lending pairs are added often are added
                  often, so check back later. Don't be a stranger.
                </TableEmpty>
              )}
            </Table>
          </div>
        </main>
      </Layout>
    </DisabledPage>
  )
}

export default Lend

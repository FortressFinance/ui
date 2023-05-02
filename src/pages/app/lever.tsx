import { NextPage } from "next"

import { useActiveChainId } from "@/hooks"

import { DisabledPage } from "@/components"
import Layout from "@/components/Layout"
import { LeverPosition } from "@/components/LeverPosition"
import Seo from "@/components/Seo"

import { lendingPairs } from "@/constant"
import { DISABLE_LENDING } from "@/constant/env"

const Lever: NextPage = () => {
  const chainId = useActiveChainId()
  const chainLendingPairs = lendingPairs.filter((n) => n.chainId === chainId)

  return (
    <DisabledPage isDisabled={DISABLE_LENDING}>
      <Layout>
        <Seo templateTitle="Lever" />

        <main>
          <div className="grid grid-cols-1 gap-4 xl:gap-6">
            <h1 className="font-display text-4xl">Lever</h1>

            <div>
              {chainLendingPairs.map(({ chainId, pairAddress }) => (
                <LeverPosition
                  key={pairAddress}
                  chainId={chainId}
                  pairAddress={pairAddress}
                />
              ))}
            </div>
          </div>
        </main>
      </Layout>
    </DisabledPage>
  )
}

export default Lever

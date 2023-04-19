import { NextPage } from "next"

import { useActiveChainConfig } from "@/hooks"

import { DisabledPage } from "@/components"
import Layout from "@/components/Layout"
import { LendingPair } from "@/components/LendingPair"
import Seo from "@/components/Seo"

import { DISABLE_LENDING } from "@/constant/env"

const Lend: NextPage = () => {
  const chainConfig = useActiveChainConfig()

  return (
    <DisabledPage isDisabled={DISABLE_LENDING}>
      <Layout>
        <Seo templateTitle="Lend" />

        <main>
          <div className="grid grid-cols-1 gap-4 xl:gap-6">
            <h1 className="font-display text-4xl">Lend</h1>

            <div>
              {chainConfig.lendingPairs.map((pairAddress) => (
                <LendingPair key={pairAddress} pairAddress={pairAddress} />
              ))}
            </div>
          </div>
        </main>
      </Layout>
    </DisabledPage>
  )
}

export default Lend

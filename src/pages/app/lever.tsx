import { NextPage } from "next"

import { useActiveChainConfig } from "@/hooks"

import { DisabledPage } from "@/components"
import Layout from "@/components/Layout"
import { LeverPosition } from "@/components/LeverPosition"
import Seo from "@/components/Seo"

import { DISABLE_LENDING } from "@/constant/env"

const Lever: NextPage = () => {
  const chainConfig = useActiveChainConfig()

  return (
    <DisabledPage isDisabled={DISABLE_LENDING}>
      <Layout>
        <Seo templateTitle="Lever" />

        <main>
          <div className="grid grid-cols-1 gap-4 xl:gap-6">
            <h1 className="font-display text-4xl">Lever</h1>

            <div>
              {chainConfig.lendingPairs.map((pairAddress) => (
                <LeverPosition key={pairAddress} pairAddress={pairAddress} />
              ))}
            </div>
          </div>
        </main>
      </Layout>
    </DisabledPage>
  )
}

export default Lever

import { NextPage } from "next"

import { DisabledPage } from "@/components"
import Layout from "@/components/Layout"
import { LeverPairs } from "@/components/LeverPosition"
import Seo from "@/components/Seo"

import { DISABLE_LENDING } from "@/constant/env"

const LeverIndex: NextPage = () => {
  return (
    <DisabledPage isDisabled={DISABLE_LENDING}>
      <Layout>
        <Seo templateTitle="Lever" />

        <div className="grid gap-4 lg:grid-cols-[1fr,3fr] lg:gap-6">
          <aside className="max-lg:row-start-2">
            <LeverPairs />
          </aside>

          <main className="rounded-lg bg-pink-900/80 p-3 backdrop-blur-md lg:p-6">
            <header className="mb-3">
              <h1 className="font-display text-4xl">Lever</h1>
            </header>
            <p className="mt-3 leading-relaxed text-white/75 lg:text-lg">
              Amplify your yield farming with leverage. Select an
              fcAsset/fctrAsset to get started.
            </p>
          </main>
        </div>
      </Layout>
    </DisabledPage>
  )
}

export default LeverIndex

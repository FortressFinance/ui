import { NextPage } from "next"

import { DisabledPage } from "@/components"
import Layout from "@/components/Layout"
import Seo from "@/components/Seo"

import { DISABLE_LENDING } from "@/constant/env"

const Lend: NextPage = () => {
  return (
    <DisabledPage isDisabled={DISABLE_LENDING}>
      <Layout>
        <Seo templateTitle="Lend" />

        <main>Lend</main>
      </Layout>
    </DisabledPage>
  )
}

export default Lend

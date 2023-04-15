import { NextPage } from "next"

import { DisabledPage } from "@/components"
import Layout from "@/components/Layout"
import Seo from "@/components/Seo"

import { DISABLE_LENDING } from "@/constant/env"

const Lever: NextPage = () => {
  return (
    <DisabledPage isDisabled={DISABLE_LENDING}>
      <Layout>
        <Seo templateTitle="Lever" />

        <main>Lever</main>
      </Layout>
    </DisabledPage>
  )
}

export default Lever

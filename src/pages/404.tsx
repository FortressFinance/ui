import * as React from "react"

import Layout from "@/components/Layout"
import Seo from "@/components/Seo"

export default function NotFoundPage() {
  return (
    <Layout>
      <Seo templateTitle="Not Found" />

      <main>404</main>
    </Layout>
  )
}

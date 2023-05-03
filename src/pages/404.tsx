import Link from "next/link"
import * as React from "react"

import { resolvedRoute } from "@/lib/helpers"

import Layout from "@/components/Layout"
import Seo from "@/components/Seo"

export default function NotFoundPage() {
  return (
    <Layout>
      <Seo templateTitle="Not Found" />

      <main>
        <h1 className="font-display text-4xl">Not found</h1>
        <p className="mt-3">
          It looks like you're a little lost, friend. Try{" "}
          <Link {...resolvedRoute("/app/yield")} className="underline">
            returning home
          </Link>
          .
        </p>
      </main>
    </Layout>
  )
}

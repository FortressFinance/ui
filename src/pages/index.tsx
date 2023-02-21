import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from "next"
import Image from "next/image"

import { ButtonLink } from "@/components/Button"
import ExternalLinks from "@/components/ExternalLinks"
import Seo from "@/components/Seo"

import FortressLogoAnimated from "~/images/fortress-animated-logo.gif"
import SwordImage from "~/images/sword.gif"
import FortressLogo from "~/svg/fortress-logo.svg"

type Data = {
  appUrl: string
}

export const getServerSideProps: GetServerSideProps<Data> = async (context) => {
  const host = context.req.headers.host || "fortress.finance"
  const appUrl =
    process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
      ? `https://${host}/app`
      : host.includes("localhost")
      ? `http://app.${host}`
      : `https://app.${host}`
  return { props: { appUrl } }
}

const HomePage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ appUrl }) => {
  return (
    <div className="h-screen w-screen bg-gradient-to-br from-pink to-orange p-2 lg:p-4">
      <Seo description="Fortress provides composable financial products for passive DeFi investors"/>

      <div className="grid h-full w-full grid-cols-1 grid-rows-[auto,1fr,auto] bg-dark">
        <header className="layout group flex items-center justify-between py-10">
          <FortressLogo
            className="h-auto w-7 fill-white group-hover:hidden"
            aria-label="Fortress Finance"
          />
          <Image
            className="hidden h-auto w-7 group-hover:flex"
            priority
            src={FortressLogoAnimated}
            alt=""
          />
        </header>

        <main className="grid h-full w-full items-center justify-center">
          <div className="layout lg:space-between lg:flex lg:w-full lg:max-w-4xl">
            {/* Mobile sword image */}
            <div className="mb-6 w-28 -scale-x-100 lg:hidden">
              <Image src={SwordImage} priority alt="" />
            </div>
            <div>
              <h1 className="font-display text-4xl uppercase lg:max-w-2xl lg:text-7xl">
                Fortress Finance is a new arbitrage protocol.
              </h1>
              <p className="mt-4 text-xl lg:mt-6 lg:text-3xl">
                Fortress introduces a new suite of tools built on Curve and
                Balancer.
              </p>
              <ButtonLink
                className="mt-6 px-8"
                href={`${appUrl}/yield`}
                size="large"
                external
              >
                Launch App
              </ButtonLink>
            </div>

            {/* Desktop sword image */}
            <div className="hidden w-64 lg:block">
              <Image src={SwordImage} priority alt="" />
            </div>
          </div>
        </main>

        <footer className="layout py-10">
          <ExternalLinks showHelp className="justify-center md:justify-end" />
        </footer>
      </div>
    </div>
  )
}

export default HomePage

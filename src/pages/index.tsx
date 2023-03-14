import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from "next"
import Image from "next/image"
import Link from "next/link"

import Button from "@/components/Button"
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
    <div className="h-screen-small overflow-hidden bg-gradient-to-br from-pink to-orange p-2 lg:p-4">
      <Seo />

      <div className="grid h-full w-full grid-cols-1 grid-rows-[auto,1fr,auto] overflow-auto bg-dark">
        <header className="md:layout py-10 max-md:px-8">
          <Link
            className="group my-3 inline-block h-11 px-1 py-2 md:my-4"
            href="/"
          >
            <FortressLogo
              className="h-full w-auto fill-white md:group-hover:hidden"
              aria-label="Fortress Finance"
            />
            <Image
              className="hidden h-full w-auto md:group-hover:flex"
              priority
              src={FortressLogoAnimated}
              alt=""
            />
          </Link>
        </header>

        <main className="grid h-full w-full items-center md:justify-center">
          <div className="md:layout lg:space-between max-md:px-8 lg:grid lg:w-full lg:max-w-4xl lg:grid-cols-[auto,1fr]">
            <div>
              <h1 className="font-display text-4xl uppercase lg:max-w-2xl lg:text-7xl">
                Fortress Finance
              </h1>
              <p className="mt-4 max-w-xl lg:mt-6 lg:text-2xl">
                Fortress provides composable financial products for passive DeFi
                investors.
              </p>
              <a href={`${appUrl}/yield`} target="_self">
                <Button
                  className="mt-6 px-8 transition-transform enabled:hover:-translate-y-0.5 lg:mt-8"
                  size="large"
                >
                  Launch DApp
                </Button>
              </a>
            </div>

            {/* Desktop sword image */}
            <div className="w-52 max-lg:hidden">
              <Image
                src={SwordImage}
                className="h-auto w-28 md:w-52"
                priority
                alt=""
              />
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

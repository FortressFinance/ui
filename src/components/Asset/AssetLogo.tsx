import Image from "next/image"
import { FC, useState } from "react"
import { BiErrorCircle } from "react-icons/bi"
import { Address } from "wagmi"

import clsxm from "@/lib/clsxm"
import useActiveChainId from "@/hooks/useActiveChainId"
import useTokenOrNative from "@/hooks/useTokenOrNative"

import { chains } from "@/components/AppProviders"
import Spinner from "@/components/Spinner"

export type AssetLogoProps = {
  className?: string
  tokenAddress?: Address
}

const TOKEN_LOGOS_API_URL =
  "https://raw.githubusercontent.com/FortressFinance/assets/master/blockchains"

const LOGOS_NETWORK_NAME: Record<string, string> = {
  arbitrum: "arbitrum",
  arbitrumFork: "arbitrum",
  mainnet: "ethereum",
  mainnetFork: "ethereum",
}

export const AssetLogo: FC<AssetLogoProps> = ({ className, tokenAddress }) => {
  const [isError, setIsError] = useState(false)

  const chainId = useActiveChainId()
  const [supportedChain] = chains.filter((n) => n.id === chainId)
  const logosNetworkName = LOGOS_NETWORK_NAME[supportedChain.network]

  const { data: token } = useTokenOrNative({ address: tokenAddress })

  const handleAssetLogoError = () => {
    setIsError(true)
    // eslint-disable-next-line no-console
    console.error(
      `Asset logo missing`,
      token?.name ?? "Loading...",
      tokenAddress
    )
  }

  return (
    <div
      className={clsxm(
        "relative overflow-hidden rounded-full bg-white p-[2px] ring-0 ring-inset ring-white",
        className
      )}
    >
      {tokenAddress ? (
        isError ? (
          <BiErrorCircle className="col-span-full row-span-full h-full w-full fill-dark/50" />
        ) : (
          <Image
            src={`${TOKEN_LOGOS_API_URL}/${logosNetworkName}/assets/${tokenAddress}/logo.png`}
            alt=""
            className="h-full w-full"
            onError={handleAssetLogoError}
            width={256}
            height={256}
            priority
          />
        )
      ) : (
        <Spinner className="col-span-full row-span-full h-full w-full fill-dark/50" />
      )}
    </div>
  )
}

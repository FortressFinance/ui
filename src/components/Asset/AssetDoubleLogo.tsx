import Image from "next/image"
import { FC, useState } from "react"
import { BiErrorCircle } from "react-icons/bi"
import { Address } from "wagmi"

import clsxm from "@/lib/clsxm"
import { enabledNetworks } from "@/lib/wagmi"
import { useActiveChainId, useClientReady, useTokenOrNative } from "@/hooks"

import Spinner from "@/components/Spinner"

export type AssetDoubleLogoProps = {
  className?: string
  mainTokenAddress?: Address
  secondTokenAddress?: Address
}
const TOKEN_LOGOS_API_URL =
  "https://raw.githubusercontent.com/FortressFinance/assets/master/blockchains"

const LOGOS_NETWORK_NAME: Record<string, string> = {
  arbitrum: "arbitrum",
  arbitrumFork: "arbitrum",
  mainnet: "ethereum",
  mainnetFork: "ethereum",
}

export const AssetDoubleLogo: FC<AssetDoubleLogoProps> = ({
  className,
  mainTokenAddress,
  secondTokenAddress,
}) => {
  const isClientReady = useClientReady()
  const [isMainError, setIsMainError] = useState(false)
  const [isSecondError, setIsSecondError] = useState(false)
  const isMainTokenAddressUndefined =
    mainTokenAddress === "0x" || mainTokenAddress === undefined
  const isSecondTokenAddressUndefined =
    secondTokenAddress === "0x" || secondTokenAddress === undefined

  const chainId = useActiveChainId()
  const [supportedChain] = enabledNetworks.chains.filter(
    (n) => n.id === chainId
  )
  const logosNetworkName = LOGOS_NETWORK_NAME[supportedChain.network]

  const { data: mainToken } = useTokenOrNative({ address: mainTokenAddress })
  const { data: secondToken } = useTokenOrNative({
    address: secondTokenAddress,
  })

  const handleMainAssetLogoError = () => {
    setIsMainError(true)
    // eslint-disable-next-line no-console
    console.error(
      `Main asset logo missing`,
      mainToken?.name ?? "Loading...",
      mainTokenAddress
    )
  }

  const handleSecondAssetLogoError = () => {
    setIsSecondError(true)
    // eslint-disable-next-line no-console
    console.error(
      `Second asset logo missing`,
      secondToken?.name ?? "Loading...",
      secondTokenAddress
    )
  }

  return (
    <div className={clsxm("relative p-[2px]", className)}>
      {isClientReady ? (
        <div className="relative flex flex-row">
          <div className="overflow-hidden rounded-full bg-white ring-0 ring-inset ring-white">
            {isMainError || isMainTokenAddressUndefined ? (
              <BiErrorCircle className="col-span-full row-span-full h-full w-full fill-dark/50" />
            ) : (
              <Image
                src={`${TOKEN_LOGOS_API_URL}/${logosNetworkName}/assets/${mainTokenAddress}/logo.png`}
                alt=""
                className="h-full w-full"
                onError={handleMainAssetLogoError}
                width={256}
                height={256}
                priority
              />
            )}
          </div>
          <div className="absolute -right-1 bottom-0 h-1/2 w-1/2 overflow-hidden rounded-full bg-white p-[1px] ring-0 ring-inset ring-white">
            {isSecondError || isSecondTokenAddressUndefined ? (
              <BiErrorCircle className="col-span-full row-span-full h-full w-full fill-dark/50" />
            ) : (
              <Image
                src={`${TOKEN_LOGOS_API_URL}/${logosNetworkName}/assets/${secondTokenAddress}/logo.png`}
                alt=""
                className="h-full w-full"
                onError={handleSecondAssetLogoError}
                width={256}
                height={256}
                priority
              />
            )}
          </div>
        </div>
      ) : (
        <Spinner className="col-span-full row-span-full h-full w-full fill-dark/50" />
      )}
    </div>
  )
}

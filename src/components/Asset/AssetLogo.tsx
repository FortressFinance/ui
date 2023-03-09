import Image from "next/image"
import { FC, useState } from "react"
import { BiErrorCircle } from "react-icons/bi"
import { Address } from "wagmi"

import clsxm from "@/lib/clsxm"
import useActiveChainId from "@/hooks/useActiveChainId"

import { chains } from "@/components/AppProviders"

export type AssetLogoProps = {
  className?: string
  tokenAddress?: Address
}

export const AssetLogo: FC<AssetLogoProps> = ({ className, tokenAddress }) => {
  const [isError, setIsError] = useState(false)

  const chainId = useActiveChainId()
  const [supportedChain] = chains.filter((n) => n.id === chainId)

  return (
    <div
      className={clsxm(
        "relative overflow-hidden rounded-full bg-white p-[2px] ring-0 ring-inset ring-white",
        className
      )}
    >
      {isError ? (
        <BiErrorCircle className="col-span-full row-span-full h-full w-full fill-dark/50" />
      ) : (
        <Image
          src={`/images/assets/${supportedChain.network}/${tokenAddress}.webp`}
          alt=""
          className="h-full w-full"
          onError={() => setIsError(true)}
          width={256}
          height={256}
          priority
        />
      )}
    </div>
  )
}

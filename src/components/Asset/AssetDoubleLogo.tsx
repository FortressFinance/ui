import { FC } from "react"
import { Address } from "wagmi"

import clsxm from "@/lib/clsxm"
import { useClientReady } from "@/hooks"

import { AssetLogo } from "@/components/Asset/AssetLogo"
import Spinner from "@/components/Spinner"

export type AssetDoubleLogoProps = {
  className?: string
  chainId?: number
  mainTokenAddress?: Address
  secondTokenAddress?: Address
}

export const AssetDoubleLogo: FC<AssetDoubleLogoProps> = ({
  className,
  chainId,
  mainTokenAddress,
  secondTokenAddress,
}) => {
  const isClientReady = useClientReady()

  return (
    <div className={clsxm("relative", className)}>
      {isClientReady ? (
        <>
          <div className="relative flex flex-row">
            <AssetLogo tokenAddress={mainTokenAddress} chainId={chainId} />
          </div>
          <div className="absolute -right-1 bottom-0 h-1/2 w-1/2">
            <AssetLogo
              tokenAddress={secondTokenAddress}
              className="!p-px"
              chainId={chainId}
            />
          </div>
        </>
      ) : (
        <Spinner className="col-span-full row-span-full h-full w-full fill-dark/50" />
      )}
    </div>
  )
}

import Image from "next/image"
import { CSSProperties, FC, useMemo, useState } from "react"
import { BiErrorCircle } from "react-icons/bi"
import { Address } from "wagmi"

import clsxm from "@/lib/clsxm"
import useCurrencyLogoURI from "@/hooks/useCurrencyLogoURIs"

import BalancerLogo from "~/images/assets/balancer.png"
import CurveLogo from "~/images/assets/curve.png"

export type AssetLogoProps = {
  name?: string
  className?: string
  style?: CSSProperties
  tokenAddress?: Address
}

export const AssetLogo: FC<AssetLogoProps> = ({
  className,
  name,
  tokenAddress,
  style,
}) => {
  const [isError, setIsError] = useState(false)

  const { logoURI } = useCurrencyLogoURI(tokenAddress || "0x")
  const isStatic = name === "curve" || name === "balancer"
  const imageSrc = useMemo(() => {
    switch (name) {
      case "curve":
        return CurveLogo
      case "balancer":
        return BalancerLogo
      case "token":
        return logoURI
      default:
        return ""
    }
  }, [name, logoURI])

  return (
    <div
      className={clsxm(
        "relative overflow-hidden rounded-full bg-white",
        className
      )}
      style={style}
    >
      {isError ? (
        <BiErrorCircle className="col-span-full row-span-full h-full w-full fill-dark/50" />
      ) : (
        <Image
          src={imageSrc}
          alt=""
          className={clsxm({ "h-full w-full object-contain p-0.5": isStatic })}
          onError={() => setIsError(true)}
          fill
          priority
        />
      )}
    </div>
  )
}

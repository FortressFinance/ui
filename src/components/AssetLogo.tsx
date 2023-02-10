import Image from "next/image"
import { CSSProperties, FC } from "react"

import useCurrencyLogoURI from "@/hooks/useCurrencyLogoURIs"

import AuraLogo from "~/images/assets/aura.png"
import BalancerLogo from "~/images/assets/balancer.png"
import CurveLogo from "~/images/assets/curve.png"

type AssetLogoProps = {
  name: string
  className: string
  style?: CSSProperties
  tokenAddress?: `0x${string}`
}

const AssetLogo: FC<AssetLogoProps> = ({
  className,
  name,
  tokenAddress,
  style,
}) => {
  const { logoURI } = useCurrencyLogoURI(tokenAddress || "0x")

  const getImage = (name: string) => {
    switch (name) {
      case "curve":
        return <Image src={CurveLogo} priority alt="" />
      case "balancer":
        return <Image src={BalancerLogo} priority alt="" />
      case "crypto":
        return <Image src={AuraLogo} priority alt="" />
      case "token":
        return <Image src={logoURI} priority alt="" fill />
      default:
        return <Image src="" priority alt="" fill />
    }
  }

  return (
    <span className={className} style={style}>
      {getImage(name)}
    </span>
  )
}

export default AssetLogo

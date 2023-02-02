import Image from "next/image"
import { FC } from "react"

import BalancerLogo from "~/images/assets/balancer.png"
import CurveLogo from "~/images/assets/curve.png"

type AssetLogoProps = {
  name: string
  className: string
}

const AssetLogo: FC<AssetLogoProps> = ({ className, name }) => {
  switch (name) {
    case "curve":
      return <Image src={CurveLogo} className={className} priority alt="" />
    case "balancer":
      return <Image src={BalancerLogo} className={className} priority alt="" />
    case "token":
      // use CurveLogo for now
      return <Image src={CurveLogo} className={className} priority alt="" />
    default:
      return null
  }
}

export default AssetLogo

import Image from "next/image"
import { FC } from "react"
import { Address } from "wagmi"

import { VaultType } from "@/lib/types"

import { AssetLogo } from "@/components/Asset"

import BalancerLogo from "~/images/assets/balancer.png"
import FortressBalancerLogo from "~/images/assets/balancer.png"
import CurveLogo from "~/images/assets/curve.png"
import FortressCurveLogo from "~/images/assets/curve.png"

type MultiLayerTokenLogoProps = {
  tokens: Address[] | readonly Address[] | undefined
  vaultType: VaultType
  isLpToken: boolean
  className: string
  size: number
}

type BaseLogoProps = {
  vaultType: VaultType
  isLpToken: boolean
  className: string
}

const BaseLogo: FC<BaseLogoProps> = ({ vaultType, isLpToken, className }) => {
  switch (vaultType) {
    case "curve":
      return isLpToken ? (
        <Image src={CurveLogo} className={className} priority alt="" />
      ) : (
        <Image src={FortressCurveLogo} className={className} priority alt="" />
      )
    case "balancer":
      return !isLpToken ? (
        <Image src={BalancerLogo} className={className} priority alt="" />
      ) : (
        <Image
          src={FortressBalancerLogo}
          className={className}
          priority
          alt=""
        />
      )
    default:
      return null
  }
}

const MultiLayerTokenLogo: FC<MultiLayerTokenLogoProps> = ({
  tokens,
  vaultType,
  isLpToken,
  className,
  size,
}) => {
  const getSubLogosPositions = (
    numberOfCurrencyIcons: number | undefined,
    rx: number,
    ry: number
  ) => {
    const _positions: { x: number; y: number }[] = []
    let posX: number, posY: number, theta: number

    if (!numberOfCurrencyIcons) {
      return []
    }
    const frags = 360 / numberOfCurrencyIcons
    const offset = numberOfCurrencyIcons > 2 ? Math.PI / 2 : 0

    for (let i = 0; i < numberOfCurrencyIcons; i++) {
      theta = (frags / 180) * i * Math.PI - offset
      posX = Math.round(rx * Math.cos(theta))
      posY = Math.round(ry * Math.sin(theta))
      _positions.push({ x: posX, y: posY })
    }

    return _positions
  }

  const positions = getSubLogosPositions(tokens?.length, size / 4, size / 4)

  return (
    <span className="relative h-8 w-8 text-xs">
      <BaseLogo
        vaultType={vaultType}
        isLpToken={isLpToken}
        className={className}
      />
      {tokens &&
        tokens.map((token, index) => {
          const top: string = size / 1.5 - 1 + positions[index].x + "px"
          const left: string = size / 1.5 + positions[index].y + "px"

          return (
            <AssetLogo
              key={`sublogo-${index}`}
              className="absolute"
              name="token"
              tokenAddress={token}
              style={{
                top: top,
                left: left,
                width: size / 2,
                height: size / 2,
              }}
            />
          )
        })}
    </span>
  )
}
export default MultiLayerTokenLogo

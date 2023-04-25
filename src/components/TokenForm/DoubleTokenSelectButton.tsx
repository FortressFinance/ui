import { FC, MouseEventHandler } from "react"
import { Address } from "wagmi"

import { AssetSymbol } from "@/components/Asset"
import { AssetDoubleLogo } from "@/components/Asset/AssetDoubleLogo"

import { FortIconChevronDown } from "@/icons"

import { doubleTokens } from "@/constant/tokens"

type DoubleTokenSelectButtonProps = {
  canChange?: boolean
  tokenAddress: Address
  onClick: MouseEventHandler<HTMLButtonElement>
}

const DoubleTokenSelectButton: FC<DoubleTokenSelectButtonProps> = ({
  canChange = false,
  tokenAddress,
  onClick,
}) => {
  const tokens = doubleTokens?.[tokenAddress]
  const mainToken = tokens?.[0]
  const secondToken = tokens?.[1]
  return canChange ? (
    <button
      type="button"
      className="flex h-8 items-center space-x-1 justify-self-end rounded bg-white pl-1.5 pr-2.5 text-xs font-medium text-black"
      onClick={onClick}
    >
      <AssetDoubleLogo
        className="h-6 w-6"
        mainTokenAddress={mainToken}
        secondTokenAddress={secondToken}
      />
      <AssetSymbol address={tokenAddress} />
      <FortIconChevronDown className="h-2.5 w-2.5 stroke-black" />
    </button>
  ) : (
    <div className="flex h-8 items-center space-x-1 justify-self-end rounded bg-white pl-1.5 pr-2.5 text-xs font-medium text-black">
      <AssetDoubleLogo
        className="h-6 w-6"
        mainTokenAddress={mainToken}
        secondTokenAddress={secondToken}
      />
      <AssetSymbol address={tokenAddress} />
    </div>
  )
}

export default DoubleTokenSelectButton

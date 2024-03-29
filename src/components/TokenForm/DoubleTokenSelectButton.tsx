import { FC, MouseEventHandler } from "react"
import { Address } from "wagmi"

import { useDoubleTokenConfig } from "@/hooks/useDoubleTokenConfig"

import { AssetSymbol } from "@/components/Asset"
import { AssetDoubleLogo } from "@/components/Asset/AssetDoubleLogo"

import { FortIconChevronDown } from "@/icons"

type DoubleTokenSelectButtonProps = {
  canChange?: boolean
  chainId?: number
  tokenAddress: Address
  onClick: MouseEventHandler<HTMLButtonElement>
}

const DoubleTokenSelectButton: FC<DoubleTokenSelectButtonProps> = ({
  canChange = false,
  chainId,
  tokenAddress,
  onClick,
}) => {
  const doubleTokens = useDoubleTokenConfig()
  const [mainToken, secondToken] = doubleTokens?.[tokenAddress] ?? []

  return canChange ? (
    <button
      type="button"
      className="flex h-8 items-center space-x-1 justify-self-end rounded bg-white pl-1.5 pr-2.5 text-xs font-medium text-black"
      onClick={onClick}
    >
      <AssetDoubleLogo
        className="h-6 w-6"
        chainId={chainId}
        mainTokenAddress={mainToken}
        secondTokenAddress={secondToken}
      />
      <AssetSymbol address={tokenAddress} chainId={chainId} />
      <FortIconChevronDown className="h-2.5 w-2.5 stroke-black" />
    </button>
  ) : (
    <div className="flex h-8 items-center space-x-1 justify-self-end rounded bg-white pl-1.5 pr-2.5 text-xs font-medium text-black">
      <AssetDoubleLogo
        className="h-6 w-6"
        chainId={chainId}
        mainTokenAddress={mainToken}
        secondTokenAddress={secondToken}
      />
      <AssetSymbol address={tokenAddress} chainId={chainId} />
    </div>
  )
}

export default DoubleTokenSelectButton

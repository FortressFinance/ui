import { FC, MouseEventHandler } from "react"
import { Address } from "wagmi"

import { AssetSymbol } from "@/components/Asset"

import { FortIconChevronDown } from "@/icons"

type TokenSelectButtonProps = {
  canChange?: boolean
  tokenAddress: Address
  onClick: MouseEventHandler<HTMLButtonElement>
}

const TokenSelectButton: FC<TokenSelectButtonProps> = ({
  canChange = false,
  tokenAddress,
  onClick,
}) => {
  return canChange ? (
    <button
      type="button"
      className="flex items-center space-x-1 justify-self-end rounded bg-white p-2 text-xs font-medium text-black"
      onClick={onClick}
    >
      <AssetSymbol address={tokenAddress} />
      <FortIconChevronDown className="h-2.5 w-2.5 stroke-black" />
    </button>
  ) : (
    <div className="flex items-center space-x-2 justify-self-end rounded bg-white p-2 text-xs font-medium text-black">
      <AssetSymbol address={tokenAddress} />
    </div>
  )
}

export default TokenSelectButton

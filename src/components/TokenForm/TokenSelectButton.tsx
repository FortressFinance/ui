import { FC, MouseEventHandler } from "react"
import { Address } from "wagmi"

import { VaultType } from "@/lib/types"

import { AssetLogo, AssetSymbol } from "@/components/Asset"

import { FortIconChevronDown } from "@/icons"

type TokenSelectButtonProps = {
  canChange?: boolean
  tokenAddress: Address
  vaultType: VaultType
  onClick: MouseEventHandler<HTMLButtonElement>
}

const TokenSelectButton: FC<TokenSelectButtonProps> = ({
  canChange = false,
  tokenAddress,
  vaultType,
  onClick,
}) => {
  return canChange ? (
    <button
      type="button"
      className="flex h-8 items-center space-x-1 justify-self-end rounded bg-white pl-1.5 pr-2 text-xs font-medium text-black"
      onClick={onClick}
    >
      <AssetLogo
        className="h-6 w-6"
        name={vaultType}
        tokenAddress={tokenAddress}
      />
      <AssetSymbol address={tokenAddress} />
      <FortIconChevronDown className="h-2.5 w-2.5 stroke-black" />
    </button>
  ) : (
    <div className="flex h-8 items-center space-x-1 justify-self-end rounded bg-white pl-1.5 pr-2 text-xs font-medium text-black">
      <AssetLogo
        className="h-6 w-6"
        name={vaultType}
        tokenAddress={tokenAddress}
      />
      <AssetSymbol address={tokenAddress} />
    </div>
  )
}

export default TokenSelectButton

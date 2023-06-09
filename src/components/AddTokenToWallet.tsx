import { FC } from "react"
import { Address, useAccount } from "wagmi"

import clsxm from "@/lib/clsxm"
import { enabledNetworks } from "@/lib/wagmi"
import { useActiveChainId, useClientReady, useTokenOrNative } from "@/hooks"

import Tooltip from "@/components/Tooltip"

import { FortIconAddToWallet } from "@/icons"

type AddTokenToWalletProps = {
  chainId?: number
  className?: string
  tokenAddress?: Address
}

export const AddTokenToWallet: FC<AddTokenToWalletProps> = ({
  chainId,
  className,
  tokenAddress,
}) => {
  const activeChainId = useActiveChainId()
  const isClientReady = useClientReady()
  const { connector, isConnected } = useAccount()
  const { data: token, isLoading } = useTokenOrNative({ address: tokenAddress })

  const isWrongChain = chainId && chainId !== activeChainId
  const isDisabled =
    !isClientReady || isLoading || !tokenAddress || !isConnected || isWrongChain
  const label = isClientReady
    ? isWrongChain
      ? `Switch to ${
          enabledNetworks.chains.find((c) => c.id === chainId)?.name
        } to add this token to your wallet`
      : token
      ? `Add ${token.symbol} to wallet`
      : isLoading
      ? "Loading token..."
      : !isConnected
      ? "You must connect a wallet to add this token to your wallet"
      : "Add to wallet"
    : "Add to wallet"

  const onClickAddToWallet = () => {
    if (tokenAddress && token?.address && connector?.watchAsset) {
      connector.watchAsset({ ...token, symbol: token.symbol.slice(0, 11) })
    }
  }

  return (
    <Tooltip label={label}>
      <button
        className={clsxm(
          "disabled:cursor-not-allowed disabled:opacity-25",
          // Intentionally not using disabled prop because the tooltip will not show if the button is disabled
          { "cursor-not-allowed opacity-25": isDisabled },
          className
        )}
        onClick={onClickAddToWallet}
      >
        <FortIconAddToWallet className="h-full w-full fill-current" />
        <span className="sr-only">{label}</span>
      </button>
    </Tooltip>
  )
}

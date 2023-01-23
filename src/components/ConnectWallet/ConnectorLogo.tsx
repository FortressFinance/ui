import { FC } from "react"

import CoinbaseWalletLogo from "~/svg/connectors/coinbase-wallet.svg"
import MetaMaskLogo from "~/svg/connectors/metamask.svg"
import WalletConnectLogo from "~/svg/connectors/wallet-connect.svg"

type ConnectorLogoProps = {
  id: string
}

const ConnectorLogo: FC<ConnectorLogoProps> = ({ id }) => {
  switch (id) {
    case "metaMask":
      return <MetaMaskLogo className="h-10 w-10" />
    case "walletConnect":
      return <WalletConnectLogo className="h-10 w-10" />
    case "coinbaseWallet":
      return <CoinbaseWalletLogo className="h-10 w-10" />
    default:
      return null
  }
}

export default ConnectorLogo

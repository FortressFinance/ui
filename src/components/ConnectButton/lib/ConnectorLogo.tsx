import { FC } from "react"

import {
  ConnIconCoinbaseWallet,
  ConnIconFrame,
  ConnIconMetaMask,
  ConnIconWalletConnect,
} from "@/icons"

type ConnectorLogoProps = {
  id: string
  name: string
  className?: string
}

const ConnectorLogo: FC<ConnectorLogoProps> = ({ className, id, name }) => {
  if (id === "metaMask") {
    return <ConnIconMetaMask className={className} />
  } else if (id === "walletConnect") {
    return <ConnIconWalletConnect className={className} />
  } else if (id === "coinbaseWallet") {
    return <ConnIconCoinbaseWallet className={className} />
  } else if (name === "Frame") {
    return <ConnIconFrame className={className} />
  }
  return null
}

export default ConnectorLogo

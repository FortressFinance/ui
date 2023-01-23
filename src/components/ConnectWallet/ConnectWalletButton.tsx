import { FC } from "react"
import { useAccount } from "wagmi"

import Address from "@/components/Address"
import Button from "@/components/Button"
import { useConnectWalletContext } from "@/components/ConnectWallet/ConnectWalletProvider"

type ConnectWalletButtonProps = {
  className?: string
}

const ConnectWalletButton: FC<ConnectWalletButtonProps> = ({ className }) => {
  const { address, isConnected } = useAccount()
  const { showConnectWalletModal } = useConnectWalletContext()

  return (
    <Button className={className} onClick={showConnectWalletModal}>
      {isConnected ? <Address>{address}</Address> : <>Connect Wallet</>}
    </Button>
  )
}

export default ConnectWalletButton

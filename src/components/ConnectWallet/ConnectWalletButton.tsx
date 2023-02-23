import { FC, MouseEventHandler } from "react"
import { useAccount } from "wagmi"

import { useClientReady } from "@/hooks/util"

import Address from "@/components/Address"
import Button from "@/components/Button"

import { useConnectWallet } from "@/store/connectWallet"

type ConnectWalletButtonProps = {
  className?: string
}

const ConnectWalletButton: FC<ConnectWalletButtonProps> = ({ className }) => {
  const isReady = useClientReady()
  const { address, isConnected } = useAccount()
  const setConnectModal = useConnectWallet((state) => state.setConnectModal)

  const clickHandler: MouseEventHandler<HTMLButtonElement> = () => {
    setConnectModal(isConnected ? "connected" : "disconnected")
  }

  return (
    <Button className={className} onClick={clickHandler}>
      {isReady && isConnected ? (
        <Address>{address}</Address>
      ) : (
        <>Connect Wallet</>
      )}
    </Button>
  )
}

export default ConnectWalletButton
